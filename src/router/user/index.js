const router = require("express").Router();
const login_required = require("../../middleware/login_required");
// Middleware
router.use(login_required);
// Admin
router.use("/admin", require("./admin/"));
// User
router.use("/user", require("./user/"));
// Router
module.exports = router;
