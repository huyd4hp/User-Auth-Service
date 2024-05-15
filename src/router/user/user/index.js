const router = require("express").Router();
const handler = require("../../../helper/handlerRouter");
const UserController = require("../../../controller/user.controller");
// Router
router.get("/profile", handler(UserController.GetProfile));
router.delete("/profile", handler(UserController.DeleteAccount));
router.put("/profile", handler(UserController.UpdateProfile));
router.post("/password", handler(UserController.UpdatePassword));
// Router
module.exports = router;
