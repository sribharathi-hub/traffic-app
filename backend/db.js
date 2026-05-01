const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/trafficDB");

mongoose.connection.on("connected", () => {
    console.log("MongoDB Connected");
});

mongoose.connection.on("error", (err) => {
    console.log("MongoDB Error:", err);
});

module.exports = mongoose;