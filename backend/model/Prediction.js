const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  input: {
    f1: Number,
    f2: Number,
    f3: Number,
    f4: Number,
    f5: Number
  },
  output: {
    XGB:          Number,
    ASE:          Number,
    ML:           Number,
    LWR:          Number,
    FINAL_HYBRID: Number
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", PredictionSchema);