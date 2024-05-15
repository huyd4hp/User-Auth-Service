const UserService = require("../service/user.services");
const permission = (permission) => {
  return async (req, res, next) => {
    const CLIENT_ID = req.headers["CLIENT_ID"];
    const user = await UserService.FindUserById(CLIENT_ID);
    if (user.role !== "Admin") {
      return res.status(403).json({ status: "error", message: "Forbidden" });
    }
    next();
  };
};

module.exports = permission;
