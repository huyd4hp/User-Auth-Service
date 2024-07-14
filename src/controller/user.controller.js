const UserService = require("../service/user.services");
const producer = require("../helper/kafka_producer");
const minio = require("../helper/minio");
const { responseUser } = require("../helper/getData");
class UserController {
  static AddUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: [
          email ? null : "email is required",
          password ? null : "password is required",
        ].filter(Boolean),
      });
    }
    const newUser = await UserService.AddUser(req.body);
    return res.status(201).json({ status: "success", data: newUser });
  };
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
  static UnblockUser = async (req, res, next) => {
    const UserID = req.params.id;
    const user = await UserService.FindUserById(UserID);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    await UserService.UpdateProfile(UserID, {
      isActive: 1,
    });
    return res.status(200).json({
      status: "success",
      message: `User ${UserID} has been unblocked`,
    });
  };
  static BlockUser = async (req, res, next) => {
    const UserID = req.params.id;
    const user = await UserService.FindUserById(UserID);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    await UserService.UpdateProfile(UserID, {
      isActive: 0,
    });
    return res.status(200).json({
      status: "success",
      message: `User ${UserID} has been blocked`,
    });
  };
  static GetProfile = async (req, res, next) => {
    const CLIENT_ID = req.headers["CLIENT_ID"];
    const user = await UserService.FindUserById(CLIENT_ID);
    return res
      .status(200)
      .json({ status: "success", data: responseUser(user) });
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

    const disallowedFields = [
      "password",
      "role",
      "_id",
      "__v",
      "email",
      "avatar",
    ];
    disallowedFields.forEach((field) => {
      if (data.hasOwnProperty(field)) {
        delete data[field];
      }
    });

    const newProfile = await UserService.UpdateProfile(CLIENT_ID, data);
    producer.sendMessage("update_profile", [
      { key: CLIENT_ID, value: JSON.stringify(req.body) },
    ]);
    return res
      .status(200)
      .json({ status: "success", data: responseUser(newProfile) });
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
    const user = await UserService.UpdatePassword(
      CLIENT_ID,
      oldPassword,
      newPassword
    );
    if (!user) {
      return res
        .status(500)
        .json({ status: "error", message: "Failed to update password" });
    }
    return res
      .status(200)
      .json({ status: "success", message: "Password updated successfully" });
  };
  static UploadAvatar = async (req, res, next) => {
    if (!req.file) {
      return res.status(400).send("Failed");
    }
    const action = await minio.uploadAvatar(req.file, req.headers.CLIENT_ID);
    if (!action) {
      return res.status(500).send("Failed to upload avatar");
    }
    return res.status(200).send("Upload avatar successfully");
  };
}
module.exports = UserController;
