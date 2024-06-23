const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { EMAIL, EMAIL_PASSWORD } = require("../config/");
//
ROOT_DIR = path.join(path.resolve(__dirname), "..");
//
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });
    this.connect = false;
  }
  connection() {
    this.transporter.verify((error, _) => {
      if (error) {
        console.log(error.message);
        console.log(`${error.message}`);
      } else {
        this.connect = true;
        console.log("Mail Service is running");
      }
    });
  }

  ForgotPassword = async (receiveEmail, OTP) => {
    try {
      let htmlContent = fs.readFileSync(
        path.join(ROOT_DIR, "/template/verify_otp.html"),
        "utf8"
      );
      htmlContent = htmlContent.replace("[OTP]", OTP);
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: receiveEmail,
        subject: "Trouble signing in?",
        html: htmlContent,
      };
      this.transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
          console.log(err.message);
          return false;
        }
        return true;
      });
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };
  ResetPassword = async (receiveEmail, newPassword) => {
    try {
      let htmlContent = fs.readFileSync(
        path.join(ROOT_DIR, "/template/reset_password.html"),
        "utf8"
      );
      htmlContent = htmlContent.replace("[PASSWORD]", newPassword);
      const mailOptions = {
        from: this.transporter.options.auth.user,
        to: receiveEmail,
        subject: "Password Reset Confirmation",
        html: htmlContent,
      };
      this.transporter.sendMail(mailOptions, (err, result) => {
        if (err) {
          console.log(err.message);
          return false;
        }
        return true;
      });
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  };
}
const mailService = new MailService();

module.exports = mailService;
