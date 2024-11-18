const mongoose = require("mongoose");

class Database {
    constructor(){
        this.connect();
    }
  connect() {
    //DATABASE

    mongoose
      .connect(
        "mongodb+srv://amind:dbpassword123@canvascluster.0z2lj.mongodb.net/"
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
