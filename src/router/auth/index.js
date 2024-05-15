const router = require("express").Router();
const AuthController = require("../../controller/auth.controllers");
const handler = require("../../helper/handlerRouter");
// Endpoint
router.post("/signup", handler(AuthController.SignUp));
router.post("/login", handler(AuthController.LogIn));
router.delete("/logout", handler(AuthController.LogOut));
router.post("/refresh-token", handler(AuthController.RefreshToken));
router.post("/forgot-password", handler(AuthController.ForgotPassword));
router.post("/verify-otp", handler(AuthController.VerifyOTP));
module.exports = router;
