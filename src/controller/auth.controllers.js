const AuthService = require("../service/auth.services");
const { responseUser } = require("../helper/getData");
const JWTFactory = require("../helper/jwt_service");
const clientRedis = require("../databases/redis");

class AuthController {
  static SignUp = async (req, res, next) => {
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
    const user = await AuthService.LogIn(email, password);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password" });
    }
    if (user.isActive) {
      const payload = responseUser(user);
      // General Token
      const AT = JWTFactory.generalAccessToken(payload);
      const RT = JWTFactory.generalRefreshToken(payload);
      // Save RT to Redis
      clientRedis.set(user._id.toString(), RT);
      // Response User
      return res.status(200).json({
        status: "success",
        metadata: {
          user: payload,
          access_token: AT,
          refresh_token: RT,
        },
      });
    }
    return res.status(403).json({
      status: "error",
      message: "Contact admin to active your account",
    });
  };
  static LogOut = async (req, res, next) => {
    const { refresh_token } = req.body;
    if (!refresh_token) {
      return res
        .status(400)
        .json({ status: "error", message: "token is required" });
    }
    const action = AuthService.LogOut(refresh_token);
    if (action) {
      return res.status(204).send();
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
      metadata: {
        access_token: newToken,
      },
    });
  };
}
module.exports = AuthController;
