  const mongoose = require("mongoose");
  const colors = require("colors");
  const {
    MONGO_USERNAME,
    MONGO_PASSWORD,
    MONGO_HOST_PRIMARY,
    MONGO_HOST_SLAVE_1,
    MONGO_HOST_SLAVE_2,
    MONGO_PORT,
    MONGO_DATABASE,
  } = require("../../config");
  class Database {
    constructor() {
      this.connectString = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST_PRIMARY}:${MONGO_PORT},${MONGO_HOST_SLAVE_1}:${MONGO_PORT},${MONGO_HOST_SLAVE_2}:${MONGO_PORT}/?replicaSet=rs0`;
      this.connect();
    }
    connect() {
      mongoose
        .connect(this.connectString, {
          dbName: MONGO_DATABASE,
        })
        .then((_) => {
          console.log(colors.green("INFO:    "), "Connected to MongoDB");
        })
        .catch((error) => {
          console.log(colors.red("ERROR:    "), `${error}`);
          setTimeout(() => {
            console.log(colors.yellow("INFO:    "), "Reconnect to MongoDB");
            this.connect();
          }, 5); //
        });
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
