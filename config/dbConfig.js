const mongoose = require("mongoose");

// const User = require('./models/userSchema');
// mongoose.connect('mongodb://localhost:27017/strider', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('connected mongoose');
//     })
//     .catch(err => {
//         console.log("OH NO MONGO CONNECTION ERROR!!!!")
//         console.log(err)
//     })
const dbconfig = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/royalmobiles?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("connetcted");
  } catch {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    // console.log(err);
    process.exit();
  }
};
module.exports = dbconfig;
