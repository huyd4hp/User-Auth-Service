const AuthService = require("../service/auth.services");
const { responseUser } = require("../helper/getData");

class AuthController {
  static SignUp = async (req, res, next) => {
    // 1. Kiểm tra thông tin đăng kí
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
    // 2. Gọi Service tạo User mới
    const newUser = await AuthService.SignUp(req.body);
    if (newUser) {
      return res.status(201).json({
        status: "success",
        metadata: responseUser(newUser),
      });
    }
    return res.status(409).json({
      status: "error",
      message: "Email has already existed",
    });
  };
  static LogIn = async (req, res, next) => {
    // 1. Kiểm tra thông tin đăng nhập
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
    // 2. Gọi Service kiểm tra thông tin đăng nhập
    const metadata = await AuthService.LogIn(email, password);
    console.log(`Metadata: ${metadata}`);
    // 3.1. Sai thông tin đăng nhập
    if (!metadata) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }
    // // 3.2 Tài khoản bị khoá (isActive = False)
    if (!metadata.user.isActive) {
      return res.status(401).json({
        status: "error",
        message: "Account is locked",
      });
    }
    // 3.3 Đăng nhập hợp lệ
    return res.status(200).json({
      status: "success",
      metadata: metadata,
    });
  };
  static LogOut = async (req, res, next) => {
    // 1. Kiểm tra thông tin đăng xuất
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res
        .status(400)
        .json({ status: "error", message: "token is required" });
    }
    // 2. Gọi Service để thực hiện đăng xuất
    const action = await AuthService.LogOut(refresh_token);
    if (action) {
      return res
        .status(200)
        .json({ status: "success", message: "Logout successfully" });
    }
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  };
  static RefreshToken = async (req, res, next) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res
        .status(400)
        .json({ status: "error", message: "token is required" });
    }
    const newToken = await AuthService.RefreshToken(refresh_token);
    if (!newToken) {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }
    return res.status(200).json({
      status: "success",
      access_token: newToken,
    });
  };
}
module.exports = AuthController;
