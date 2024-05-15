const router = require("express").Router();
// Auth
router.use("/auth", require("./auth/"));
// User - RequiredLogin
router.use("/", require("./user/"));
// Export router
module.exports = router;
