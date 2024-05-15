const JWT = require("jsonwebtoken");
const access_key = require("../config").access_key;
const refresh_key = require("../config").refresh_key;
class JWTFactory {
  static generalAccessToken = (payload) => {
    const AT = JWT.sign(payload, access_key, {
      algorithm: "HS256",
      expiresIn: "1h",
    });
    return AT;
  };
  static generalRefreshToken = (payload) => {
    const RT = JWT.sign(payload, refresh_key, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
    return RT;
  };
  static verifyAccessToken = (token) => {
    return JWT.verify(token, access_key, (err, payload) => {
      if (err) {
        console.log("Error: ", err.message);
        return null;
      }
      return payload._id;
    });
  };
  static verifyRefreshToken = (token) => {
    return JWT.verify(token, refresh_key, (err, payload) => {
      if (err) {
        console.log("Error: ", err.message);
        return null;
      }
      return payload._id;
    });
  };
}
module.exports = JWTFactory;
