require("dotenv").config();

APP_PORT = process.env.APP_PORT || 5001;
DEBUG = process.env.MODE === "DEBUG";
EMAIL = process.env.EMAIL;
EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
MONGO_HOST = process.env.MONGO_HOST || "localhost";
MONGO_PORT = process.env.MONGO_PORT || 27017;
MONGO_USERNAME = process.env.MONGO_USERNAME;
MONGO_PASSWORD = process.env.MONGO_PASSWORD;
MONGO_DATABASE = process.env.MONGO_DATABASE;
REDIS_HOST = process.env.REDIS_HOST || "localhost";
REDIS_PORT = +process.env.REDIS_PORT || 6379;
KAFKA_HOST = process.env.KAFKA_HOST;
KAFKA_PORT = process.env.KAFKA_PORT;
ACCESS_KEY = process.env.ACCESS_KEY;
REFRESH_KEY = process.env.REFRESH_KEY;

module.exports = {
  APP_PORT,
  DEBUG,
  EMAIL,
  EMAIL_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DATABASE,
  REDIS_HOST,
  REDIS_PORT,
  ACCESS_KEY,
  REFRESH_KEY,
  KAFKA_HOST,
  KAFKA_PORT,
};
