const process = require("../../config/index.js");
const mongoose = require("mongoose");
const timestampsPlugin = require("../plugins/mongoosePlugin.js");

const connectDB = async () => {
  try {
    mongoose.plugin(timestampsPlugin);

    const connection = await mongoose.connect(process.db.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${connection.connection.host}`);
  } catch (err) {
    console.log("No ha sido posible realizar una conexión con la BBDD");
    console.log(` Error: ${err.message} `);
    throw err;
  }
};

module.exports = connectDB;
