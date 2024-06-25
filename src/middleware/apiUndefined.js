apiUndefined = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
};
module.exports = apiUndefined;
