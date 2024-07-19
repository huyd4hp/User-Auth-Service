cors = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,X-Request-ID"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
};

module.exports = cors;
