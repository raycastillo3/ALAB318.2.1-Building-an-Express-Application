const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

class Database {
    constructor() {
      this.connect();
    }
    connect() {
      //DATABASE
      mongoose
        .connect(
          process.env.MONGO_URI
        )
        .then(() => {
          console.log("database connection succesful");
        })
        .catch((err) => {
          console.error("database connection error " + err);
        });
    }
}

module.exports = new Database();
