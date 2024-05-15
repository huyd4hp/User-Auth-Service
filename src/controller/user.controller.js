const UserService = require("../service/user.services");
class UserController {
  static GetUsers = async (req, res, next) => {
    let { page } = req.body;
    if (!page) {
      page = 1;
    }
    const start = 1 + 50 * (page - 1);
    const users = await UserService.GetUsers(page);
    return res.status(200).json({
      status: "success",
      quantity: users.length,
      start: start,
      end: start + users.length - 1,
      metadata: users,
    });
  };
  static GetUser = async (req, res, next) => {
    const id = req.params.id;
    const user = await UserService.FindUserById(id);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: user,
    });
  };
  static DeleteUser = async (req, res, next) => {
    const id = req.params.id;
    const action = await UserService.DeleteUserById(id);
    if (action) {
      return res
        .status(200)
        .json({ status: "success", message: "Deleted user" });
    }
    return res.status(404).json({ status: "error", message: "User not found" });
  };
  static GetProfile = async (req, res, next) => {
    const CLIENT_ID = req.headers["CLIENT_ID"];
    const user = await UserService.FindUserById(CLIENT_ID);
    return res.status(200).json({ status: "success", data: user });
  };
  static DeleteAccount = async (req, res, next) => {
    const CLIENT_ID = req.headers["CLIENT_ID"];
    const action = await UserService.DeleteUserById(CLIENT_ID);
    if (action) {
      return res
        .status(200)
        .json({ status: "success", message: "Deleted account" });
    }
    return res
      .status(500)
      .json({ status: "error", message: "Failed to remove account" });
  };
  static UpdateProfile = async (req, res, next) => {
    const CLIENT_ID = req.headers["CLIENT_ID"];
    const data = req.body;
    // Không cho phép sửa password ở đây
    if (data.hasOwnProperty("password")) {
      delete data.password;
    }
    const newProfile = await UserService.UpdateProfile(CLIENT_ID, data);
    return res.status(200).json({ status: "success", data: newProfile });
  };
  static UpdatePassword = async (req, res, next) => {
    const CLIENT_ID = req.headers["CLIENT_ID"];
    const { oldPassword, newPassword, rePassword } = req.body;
    if (!oldPassword || !newPassword || !rePassword) {
      return res.status(400).json({
        status: "error",
        message: [
          oldPassword ? null : "old password is required",
          newPassword ? null : "new password is required",
          rePassword ? null : "re password is required",
        ].filter(Boolean),
      });
    }
    if (newPassword !== rePassword) {
      return res.status(400).json({
        status: "error",
        message: "New password and re password are not the same",
      });
    }
    const user = await UserService.UpdatePassword(CLIENT_ID, newPassword);
    if (!user) {
      return res
        .status(500)
        .json({ status: "error", message: "Failed to update password" });
    }
    return res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  };
}
module.exports = UserController;
