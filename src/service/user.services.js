const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const clientRedis = require("../databases/redis");
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
      console.log(err.message);
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
  };
  static UpdatePassword = async (userid, newPassword) => {
    const salt = await bcrypt.genSalt(1024);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const user = await userModel.findByIdAndUpdate(
      userid,
      {
        password: hashPassword,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return null;
    }
    return user;
  };
}
module.exports = UserService;
