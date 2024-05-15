const JWTFactory = require("../helper/jwt_service");
const clientRedis = require("../databases/redis");
const login_required = async (req, res, next) => {
  // 1. Yêu cầu AccessToken trong header
  const token = req.headers["authorization"];
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "token is required" });
  }
  // 2. Xác thực AccessToken
  const userId = JWTFactory.verifyAccessToken(token);
  if (!userId) {
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
  // 3. Xác thực user đang đăng nhập
  const RT = await clientRedis.get(userId);
  if (!RT) {
    // 3.1 User đã đăng xuất -> Không có RT trong Redis
    // 3.2 User bị lộ AccessToken
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
  // 4. Chấp nhận AccessToken
  /// 4.1 Gắn userId vào header
  req.headers.CLIENT_ID = userId;
  next();
};

module.exports = login_required;
