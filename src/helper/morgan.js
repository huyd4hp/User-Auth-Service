const morgan = require("morgan");
const colors = require("colors");
const path = require("path");
const fs = require("fs");

const logPath = path.join(__dirname, "logs");

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

const logFile = path.join(logPath, "app.log");
morgan.format("custom", function (tokens, req, res) {
  return [
    colors.green(`Method: ${tokens.method(req, res)}`), // Phương thức HTTP
    `IP: ${tokens["remote-addr"](req, res)}`, // Địa chỉ IP
    `Request-ID: ${req.headers["x-request-id"]}`, // Tracking ID
    `Time: ${tokens.date(req, res, "clf")}`, // Thời gian
    `URL: ${tokens.url(req, res)}`, // URL yêu cầu
    `Status: ${tokens.status(req, res)}`, // Mã trạng thái
  ].join("  |  ");
});

const logger = morgan("custom", {
  stream: fs.createWriteStream(logFile, { flags: "a" }),
});

module.exports = logger;
