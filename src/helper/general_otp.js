function generateOTP() {
  return Math.floor(Math.random() * 1000000);
}
module.exports = generateOTP;
