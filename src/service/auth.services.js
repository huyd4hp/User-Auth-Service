const UserService = require("../service/user.services");
const JWTFactory = require("../helper/jwt_service");
const blacklistModel = require("../model/blacklist.model");
const bcrypt = require("bcrypt");
const { responseUser } = require("../helper/getData");
const clientRedis = require("../databases/redis");
const generalOTP = require("../helper/general_otp");
const MailService = require("../helper/mail");
const otpModel = require("../model/otp.model");
const generalPassword = require("../helper/general_password");
// AuthService
class AuthService {
  static SignUp = async (data) => {
    // 1. Xác thực thông tin đăng kí
    const holderUser = await UserService.FindUserByEmail(data.email);
    if (holderUser) {
      return null;
    }
    // 2. Tạo User mới trả về controller
    const newUser = await UserService.AddUser(data);
    return newUser;
  };
  static LogIn = async (email, password) => {
    // 1. Xác thực thông tin đăng nhập
    /// 1. Kiểm tra email
    const holderUser = await UserService.FindUserByEmail(email);
    if (!holderUser) {
      return null;
    }
    /// 2. Kiểm tra password
    const checkPassword = bcrypt.compareSync(password, holderUser.password);
    if (!checkPassword) {
      return null;
    }
    // 2. Tạo AccessToken và RefreshToken
    const payload = responseUser(holderUser);
    const AT = JWTFactory.generalAccessToken(payload);
    const RT = JWTFactory.generalRefreshToken(payload);
    // 3. Thêm RefreshToken vào Redis (Tạo Session cho User)
    await clientRedis.set(holderUser._id.toString(), RT);
    // 4. Trả metadata (AT,RT,User) về controller
    const metadata = {
      user: payload,
      access_token: AT,
      refresh_token: RT,
    };
    return metadata;
  };
  static LogOut = async (token) => {
    // 1. Xác thực RefreshToken
    const userId = JWTFactory.verifyRefreshToken(token);
    if (!userId) {
      return false;
    }
    // 2. Check session của userId trong Redis
    const sessionToken = await clientRedis.get(userId.toString());
    if (token !== sessionToken) {
      return false;
    }
    // 3. Delete session trong Redis (Thêm vào blacklistModel)
    await blacklistModel.create({
      user: userId,
      refreshToken: token,
    });
    await clientRedis.del(userId.toString());
    return true;
  };
  static RefreshToken = async (token) => {
    // 1. Xác thực RefreshToken
    const userId = JWTFactory.verifyRefreshToken(token);
    if (!userId) {
      return null;
    }
    // 2. Check session của userId
    const usingToken = await clientRedis.get(userId.toString());
    if (usingToken !== token) {
      return null;
    }
    // 3. Renew token cho userId
    const user = await UserService.FindUserById(userId);
    if (!user) {
      return null;
    }
    const payload = responseUser(user);
    const newToken = JWTFactory.generalAccessToken(payload);
    return newToken;
  };
  static ForgotPassword = async (email) => {
    // 1. Check email đã đăng kí chưa
    const user = await UserService.FindUserByEmail(email);
    if (!user) {
      return -1;
    }
    // 2. Kiểm tra OTPModel - 1 User tối đa yêu cầu 5 OTP
    const otpObject = await otpModel.findOne({ user: user._id }).lean();
    if (!otpObject || otpObject.otp.length < 5) {
      // 2.1 Tạo OTP
      const OTP = generalOTP();
      // 2.2. Gửi Email
      const result = await MailService.ForgotPassword(email, OTP);
      if (!result) {
        return false;
      }
      // 2.3 Lưu OTP vào database
      if (!otpObject) {
        await otpModel.create({
          user: user._id,
          otp: [OTP],
        });
      } else {
        await otpModel.updateOne({ user: user._id }, { $push: { otp: OTP } });
      }
      return true;
    }
    return 1;
  };
  static VerifyOTP = async (email, otp) => {
    const user = await UserService.FindUserByEmail(email);
    if (!user) {
      return false;
    }
    const userID = user._id;
    const otpObject = await otpModel.findOne({ user: userID, used: false });
    if (!otpObject) {
      return false;
    }
    if (!otpObject.otp.includes(otp)) {
      return false;
    }
    const randomPassword = generalPassword();
    const action = await UserService.ResetPassword(userID, randomPassword);
    if (!action) {
      return false;
    }
    await MailService.ResetPassword(email, randomPassword);
    await UserService.ResetPassword(userID, randomPassword);
    await otpModel.updateOne(
      { user: userID, used: false },
      { $set: { used: true } }
    );
    return true;
  };
}
module.exports = AuthService;
