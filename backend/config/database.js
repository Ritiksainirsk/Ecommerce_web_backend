const mongoose = require("mongoose");

const connectDataBase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("mongodb connecting with server");
    })
};


module.exports = connectDataBase;
