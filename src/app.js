const express = require("express");
const helmet = require("helmet");
const clientRedis = require("./databases/redis/session");
const mailService = require("./helper/mail");
const errorHandle = require("./middleware/errorHandle");
const apiUndefined = require("./middleware/apiUndefined");
const logger = require("./helper/morgan");
const cookieParser = require("cookie-parser");
const cors = require("./helper/cors");
const promClient = require("prom-client");
const router = require("./router");
const logging = require("./logger");
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
  buckets: [50, 100, 200, 300, 400, 500, 1000],
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
app.use(cors);
// Logging
app.use(logging);
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
