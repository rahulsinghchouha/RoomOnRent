const mongoose = require("mongoose");
require("dotenv").config();
exports.connect = () =>mongoose.connect(process.env.MONGODB_URL)
        .then(()=>console.log(" Database Connected Succesfully"))
        .catch((err)=>console.log("Database Connecting issue ",err));


