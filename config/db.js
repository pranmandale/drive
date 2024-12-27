const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URI;

function connectToDB() {
    mongoose.connect(MONGO_URI).then(() => { 
        console.log("conncted to mongodb");
    })
}

module.exports = connectToDB;