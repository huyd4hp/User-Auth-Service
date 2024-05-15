const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
//
ROOT_DIR = path.join(path.resolve(__dirname), "..");
OTP_TEMPLATE = path.join(ROOT_DIR, "/template/verify_otp.html");
RESET_PASSWORD_TEMPLATE = path.join(ROOT_DIR, "/template/reset_password.html");
//
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nhathuyd4hp@gmail.com",
        pass: "wieq rcci kvay nvpu",
      },
    });
  }

  ForgotPassword = async (receiveEmail, OTP) => {
    try {
      let htmlContent = fs.readFileSync(OTP_TEMPLATE, "utf8");
      htmlContent = htmlContent.replace("[OTP]", OTP);
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: receiveEmail,
        subject: "Trouble signing in?",
        html: htmlContent,
      };
      this.transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };
  ResetPassword = async (receiveEmail, newPassword) => {
    try {
      let htmlContent = fs.readFileSync(RESET_PASSWORD_TEMPLATE, "utf8");
      htmlContent = htmlContent.replace("[PASSWORD]", newPassword);
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: receiveEmail,
        subject: "Password Reset Confirmation",
        html: htmlContent,
      };
      this.transporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };
}
const mailService = new MailService();
module.exports = mailService;
