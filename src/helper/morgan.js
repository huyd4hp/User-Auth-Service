const morgan = require("morgan");
const colors = require("colors");

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
module.exports = morgan("custom");
