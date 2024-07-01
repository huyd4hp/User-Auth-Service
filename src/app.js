const express = require("express");
const helmet = require("helmet");
const clientRedis = require("./databases/redis");
const mailService = require("./helper/mail");
const errorHandle = require("./middleware/errorHandle");
const apiUndefined = require("./middleware/apiUndefined");
const MorganCustom = require("./helper/morgan");
const router = require("./router");
// App
const app = express();
// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// Middleware
app.use(MorganCustom);
app.use(helmet());
app.use(express.json());
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
