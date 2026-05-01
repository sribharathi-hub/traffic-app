const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema({
    input: {
        f1: Number,
        f2: Number,
        f3: Number,
        f4: Number,
        f5: Number
    },
    results: [
        {
            model: String,
            value: Number,
            deltaR: Number
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Prediction", predictionSchema);