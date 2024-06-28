const router = require("express").Router();
const login_required = require("../../middleware/login_required");
const permission = require("../../middleware/permission");
const minio = require("../../helper/minio");
const UserService = require("../../service/user.services");
// Admin
router.use("/admin", login_required, permission("Admin"), require("./admin/"));
// User
router.use("/user", login_required, require("./user/"));
// Avatar
router.get("/avatar/:objectName", async (req, res, next) => {
  const objectName = req.params.objectName;
  const CLIENT_ID = objectName.split(".")[0];
  const user = await UserService.FindUserById(CLIENT_ID);
  if (!user && CLIENT_ID !== "default") {
    return res.status(404).send("User Not Found");
  }
  const { imageData, contentType } = await minio.getImageByUser(user);
  res.setHeader("Content-Type", contentType);
  imageData.pipe(res);
});
// Router
module.exports = router;
