const morgan = require("morgan");
const colors = require("colors");

morgan.format("custom", function (tokens, req, res) {
  return [
    colors.green(`Method: ${tokens.method(req, res)}`), // Phương thức HTTP
    `IP: ${tokens["remote-addr"](req, res)}`, // Địa chỉ IP
    `Time: ${tokens.date(req, res, "clf")}`, // Thời gian
    `URL: ${tokens.url(req, res)}`, // URL yêu cầu
    `Status: ${tokens.status(req, res)}`, // Mã trạng thái
    `Response Time: ${tokens["response-time"](req, res)} ms`, // Thời gian phản hồi
    `Size: ${tokens.res(req, res, "content-length")} bytes`, // Kích thước phản hồi
    `User-Agent: ${tokens["user-agent"](req, res)}`, // User-Agent
  ].join("  |  ");
});
module.exports = morgan("custom");
