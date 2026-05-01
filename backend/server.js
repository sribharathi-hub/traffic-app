const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { exec } = require("child_process");
require("dotenv").config();

const Prediction = require("./model/Prediction");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API is running");
});

app.post("/predict", async (req, res) => {
  try {
    const { f1, f2, f3, f4, f5 } = req.body;

    if (
      f1 === undefined ||
      f2 === undefined ||
      f3 === undefined ||
      f4 === undefined ||
      f5 === undefined
    ) {
      return res.status(400).json({ error: "Missing input values" });
    }

    const command = `java -jar /app/TrafficFlow.jar ${f1} ${f2} ${f3} ${f4} ${f5}`;

    exec(command, async (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: "Java execution failed" });
      }

      const prediction = stdout.trim();

      const newData = new Prediction({
        f1,
        f2,
        f3,
        f4,
        f5,
        result: prediction
      });

      await newData.save();

      res.json({ prediction });
    });

  } catch (err) {
    res.status(500).json({ error: "Prediction failed" });
  }
});

app.get("/history", async (req, res) => {
  try {
    const data = await Prediction.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});