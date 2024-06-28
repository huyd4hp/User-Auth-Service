const router = require("express").Router();
const handler = require("../../../helper/handlerRouter");
const UserController = require("../../../controller/user.controller");
const multer = require("multer");
const storage = multer.memoryStorage();
const fileFilter = require("../../../helper/fileFilter");
const upload = multer({ storage: storage, fileFilter: fileFilter });
// Router
router.get("/profile", handler(UserController.GetProfile));
router.delete("/profile", handler(UserController.DeleteAccount));
router.put("/profile", handler(UserController.UpdateProfile));
router.post("/re-password", handler(UserController.UpdatePassword));
router.post(
  "/upload-avatar",
  upload.single("avatar"),
  handler(UserController.UploadAvatar)
);
// Router
module.exports = router;
