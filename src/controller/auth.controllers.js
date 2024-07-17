const AuthService = require("../service/auth.services");
const { responseUser } = require("../helper/getData");
const clientRedis = require("../databases/redis/session");
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
    // 1.1 Không được tạo với Role là Admin
    if (req.body.role === "Admin") {
      return res.status(401).json({ status: "error", message: "Unauthorized" });
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
    // 3.3.1 Thêm RefreshToken vào Redis (Tạo Session cho User)
    await clientRedis.set(
      metadata.user._id.toString(),
      metadata.refresh_token.toString()
    );
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
        .json({ status: "error", message: "Missing Token Error" });
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
      message: "Invalid Token Error",
    });
  };
  static RefreshToken = async (req, res, next) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing Token Error" });
    }
    const newToken = await AuthService.RefreshToken(refresh_token);
    if (!newToken) {
      return res.status(401).json({
        status: "error",
        message: "Invalid Token Error",
      });
    }
    return res.status(200).json({
      status: "success",
      access_token: newToken,
    });
  };
  static ForgotPassword = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing Email Error" });
    }
    const action = await AuthService.ForgotPassword(email);
    if (action === -1) {
      return res.status(404).json({
        status: "error",
        message: "Email not found",
      });
    }
    1; // user cung cap email
    2; // server gửi otp về email xác thực
    3; // nhập otp xác thực -> server random password
    4; // user đọc email vào account rồi đổi lại mật khẩu
    if (action === 1) {
      return res.status(429).json({
        status: "error",
        message: "Too many requests. Please check your email",
      });
    }
    if (action === true) {
      return res.status(200).json({
        status: "success",
        message: "Please check your email",
      });
    }
    if (action === false) {
      return res.status(500).json({
        status: "error",
        message: "Please try again later",
      });
    }
  };
  static VerifyOTP = async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        status: "error",
        message: [
          email ? null : "email is required",
          otp ? null : "Missing OTP Error",
        ].filter(Boolean),
      });
    }
    const action = await AuthService.VerifyOTP(email, otp);
    if (!action) {
      return res.status(401).json({
        status: "error",
        message: "Invalid OTP Error",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Verify successfully",
    });
  };
}
module.exports = AuthController;
