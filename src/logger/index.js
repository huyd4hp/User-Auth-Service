const { v4: uuidv4 } = require("uuid");

logging = (req, res, next) => {
  let trackingId = req.headers["x-request-id"];
  if (!trackingId) {
    trackingId = uuidv4();
    req.headers["x-request-id"] = trackingId;
    res.cookie("tracking_id", trackingId, {
      maxAge: 900000,
      httpOnly: false,
      secure: false,
      path: "/",
    });
  }
  next();
};

module.exports = logging;
