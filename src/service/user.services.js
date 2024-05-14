const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
class UserService {
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
    return user;
  };
  static AddUser = async (data) => {
    const salt = await bcrypt.genSalt(1024);
    const hashPassword = await bcrypt.hash(data.password, salt);
    data.password = hashPassword;
    const newUser = await userModel.create(data);
    return newUser;
  };
  static UpdateUser = () => {};
  static DeleteUser = () => {};
}
module.exports = UserService;
