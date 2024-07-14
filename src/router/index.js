const router = require("express").Router();
// Auth
router.use("/auth", require("./auth/"));
//  Health-Check
router.get("/health", (req, res, next) => {
  return res.status(200).json({
    status: "success",
    message: "ok",
  });
});
// User - RequiredLogin
router.use("/", require("./user/"));
// Export router
module.exports = router;
