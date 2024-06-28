const JWT = require("jsonwebtoken");
const { ACCESS_KEY } = require("../config");
const { REFRESH_KEY } = require("../config");
class JWTFactory {
  static generalAccessToken = (payload) => {
    const AT = JWT.sign(payload, ACCESS_KEY, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    return AT;
  };
  static generalRefreshToken = (payload) => {
    const RT = JWT.sign(payload, REFRESH_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
    return RT;
  };
  static verifyAccessToken = (token) => {
    return JWT.verify(token, ACCESS_KEY, (err, payload) => {
      if (err) {
        return err.message;
      }
      return payload._id;
    });
  };
  static verifyRefreshToken = (token) => {
    return JWT.verify(token, REFRESH_KEY, (err, payload) => {
      if (err) {
        return err.message;
      }
      return payload._id;
    });
  };
}
module.exports = JWTFactory;
