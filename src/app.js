const express = require("express");
const helmet = require("helmet");
const clientRedis = require("./databases/redis/session");
const mailService = require("./helper/mail");
const errorHandle = require("./middleware/errorHandle");
const apiUndefined = require("./middleware/apiUndefined");
const MorganCustom = require("./helper/morgan");
const cookieParser = require("cookie-parser");
const morganBody = require("morgan-body");
const { v4: uuidv4 } = require("uuid");

const router = require("./router");
// App
const app = express();
app.use(cookieParser());
app.use(MorganCustom);
morganBody(app);
app.use(helmet());
app.use(express.json());
// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,X-Request-ID"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// Logging
app.use((req, res, next) => {
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
});
// Database
mailService.connection();
require("./databases/mongo");
clientRedis.connect();
// Router
app.use("/api/v1", router);
// Handle error
app.use(apiUndefined);
app.use(errorHandle);
// Export
module.exports = { app };
