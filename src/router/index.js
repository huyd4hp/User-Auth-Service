const router = require("express").Router();
const minio = require("../helper/minio");
// Auth
router.use("/auth", require("./auth/"));
// User - RequiredLogin
router.use("/", require("./user/"));
// Export router
module.exports = router;
