const router = require("express").Router();
const handler = require("../../../helper/handlerRouter");
const UserController = require("../../../controller/user.controller");
// Router
router.get("/users", handler(UserController.GetUsers));
router.get("/user/:id", handler(UserController.GetUser));
router.delete("/user/:id", handler(UserController.DeleteUser));

module.exports = router;
