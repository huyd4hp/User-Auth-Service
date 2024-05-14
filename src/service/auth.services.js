const UserService = require("../service/user.services");
const JWTFactory = require("../helper/jwt_service");
const blacklistModel = require("../model/blacklist.model");
const bcrypt = require("bcrypt");
const clientRedis = require("../databases/redis");
class AuthService {
  static SignUp = async (data) => {
    const holderUser = await UserService.FindUserByEmail(data.email);
    if (holderUser) {
      return null;
    }
    const newUser = await UserService.AddUser(data);
    return newUser;
  };
  static LogIn = async (email, password) => {
    const holderUser = await UserService.FindUserByEmail(email);
    if (!holderUser) {
      return null;
    }
    const checkPassword = bcrypt.compareSync(password, holderUser.password);
    if (!checkPassword) {
      return null;
    }
    return holderUser;
  };
  static LogOut = async (token) => {
    const userId = await JWTFactory.verifyRefreshToken(token);
    // Invalid token
    if (!userId) {
      return false;
    }
    // Check session
    sessionToken = clientRedis.get(userId.toString());
    if (token !== sessionToken) {
      return false;
    }
    // Delete session
    await blacklistModel.create({
      user: userId,
      refreshToken: token,
    });
    await clientRedis.del(userId.toString());
    return true;
  };
  static RefreshToken = async (token) => {
    // Check token
    const userId = await JWTFactory.verifyRefreshToken(token);
    if (!userId) {
      return null;
    }
    // Check session
    const usingToken = await clientRedis.get(userId.toString());
    if (usingToken !== token) {
      return null;
    }
    // Renew token
    const user = await UserService.FindUserById(userId);
    if (!user) {
      return null;
    }
    const payload = responseUser(user);
    const newToken = await JWTFactory.generalAccessToken(payload);
    return newToken;
  };
}
module.exports = AuthService;
