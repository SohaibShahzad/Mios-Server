const mongoose = require("mongoose");
const MongoURI = process.env.MONGO_URI

ConnectToMongo = () => {
  mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function () {
    console.log("Connected to MongoDB");
  });
};

module.exports = ConnectToMongo;
