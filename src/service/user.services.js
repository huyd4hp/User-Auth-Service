const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const clientRedis = require("../databases/redis/session");
class UserService {
  static GetUsers = async (page = 1) => {
    const skip = (page - 1) * 50;
    const users = await userModel.find().skip(skip).limit(50);
    return users;
  };
  static FindUserById = async (id) => {
    try {
      const user = await userModel.findById(id).lean();

      return user;
    } catch (err) {
      return null;
    }
  };
  static FindUserByEmail = async (email) => {
    const user = await userModel.findOne({ email: email }).lean();
    if (!user) {
      return null;
    }
    return user;
  };
  static AddUser = async (data) => {
    const salt = await bcrypt.genSalt(1024);
    const hashPassword = await bcrypt.hash(data.password, salt);
    data.password = hashPassword;
    const newUser = await userModel.create(data);
    return newUser;
  };
  static ResetPassword = async (userid, newPassword) => {
    // 1. Xác thực userid
    try {
      const user = await userModel.findById(userid);
    } catch (err) {
      return false;
    }
    // 2. Đổi sang newPassword
    const salt = await bcrypt.genSalt(1024);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const updated_user = await userModel.findByIdAndUpdate(
      userid,
      {
        password: hashPassword,
      },
      {
        new: true,
      }
    );
    if (!updated_user) {
      return false;
    }
    return true;
  };
  static DeleteUserById = async (id) => {
    // 1. Xoá document trong MongoDB
    const action = await userModel.deleteOne({ _id: id }).lean();
    // 2. Xoá session nếu có trong Redis
    await clientRedis.del(id);
    return action.deletedCount > 0;
  };
  static UpdateProfile = async (userid, newProfile) => {
    const newUser = await userModel.findByIdAndUpdate(userid, newProfile, {
      new: true,
    });
    return newUser;
  };
  static UpdatePassword = async (userid, oldPassword, newPassword) => {
    // 1. So sánh currentPassword vs oldPassword
    try {
      const user = await userModel.findById(userid);
      const checkPassword = bcrypt.compareSync(oldPassword, user.password);
      if (!checkPassword) {
        return false;
      }
    } catch (err) {
      return false;
    }
    // 2. Đổi sang newPassword
    const salt = await bcrypt.genSalt(1024);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const updated_user = await userModel.findByIdAndUpdate(
      userid,
      {
        password: hashPassword,
      },
      {
        new: true,
      }
    );
    if (!updated_user) {
      return false;
    }
    return true;
  };
}
module.exports = UserService;
