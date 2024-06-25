errorHandle = (err, req, res, next) => {
  const statusError = err.status || 500;
  const messageError = err.message || "Internal Server Error";
  return res.status(statusError).json({
    status: "error",
    message: messageError,
  });
};
module.exports = errorHandle;
