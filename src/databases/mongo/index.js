const mongoose = require("mongoose");
const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DATABASE,
} = require("../../config");
const { DEBUG } = require("../../config");
const connectString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}`;
class Database {
  constructor() {
    this.connect();
  }
  connect() {
    if (DEBUG) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        dbName: MONGO_DATABASE,
      })
      .then((_) => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => console.log(`Error:  ${error}!`));
  }
  //
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();
module.exports = instance;
