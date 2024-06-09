const router = require("express").Router();
const login_required = require("../../middleware/login_required");
const permission = require("../../middleware/permission");
// Middleware
router.use(login_required);
// Admin
router.use("/admin", permission("Admin"), require("./admin/"));
// User            1           2           3
router.use("/user", require("./user/"));
// Router
module.exports = router;
