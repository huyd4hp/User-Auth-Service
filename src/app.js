const express = require("express");
const helmet = require("helmet");
const clientRedis = require("./databases/redis/session");
const mailService = require("./helper/mail");
const errorHandle = require("./middleware/errorHandle");
const apiUndefined = require("./middleware/apiUndefined");
const logger = require("./helper/morgan");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const promClient = require("prom-client");
const router = require("./router");
// App
const app = express();
app.use(cookieParser());
app.use(logger);
app.use(helmet());
app.use(express.json());
// Metrics - Prometheus
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: "http_request_duration_ms",
  help: "Đo thời gian phản hồi HTTP",
  labelNames: ["method", "route", "code"],
  buckets: [50, 100, 200, 300, 400, 500, 1000], // buckets for response time from 50ms to 1000ms
});
const httpRequestCounter = new promClient.Counter({
  name: "http_requests_total",
  help: "Số lượng request HTTP",
  labelNames: ["method", "route", "code"],
});
// Middleware để thu thập metrics cho mỗi request
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({ route: req.path, code: res.statusCode, method: req.method });
    httpRequestCounter.inc({
      route: req.path,
      code: res.statusCode,
      method: req.method,
    });
  });
  next();
});

// Endpoint để trả về metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
// Endpoint để trả về metrics
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
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
