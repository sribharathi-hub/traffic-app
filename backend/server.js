const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const mongoose = require("mongoose");

const Prediction = require("./model/Prediction");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/traffic-app")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.post("/predict", (req, res) => {
  try {
    const input = JSON.stringify(req.body).replace(/"/g, '\\"');

    exec(`java -jar TrafficFlow.jar predictSingle "${input}"`, (err, stdout, stderr) => {

      if (err) {
        console.error("EXEC ERROR:", err);
        console.error("STDERR:", stderr);
        return res.status(500).json({ error: "Java execution failed" });
      }

      console.log("RAW OUTPUT:\n", stdout);

      const lines = stdout.trim().split("\n").slice(1);

      const results = lines.map(line => {
        const [model, value, deltaR] = line.split("|");
        return {
          model: model?.trim(),
          value: parseFloat(value),
          deltaR: parseFloat(deltaR)
        };
      });

      res.json(results);
    });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    res.status(500).json({ error: "Server crash" });
  }
});

app.get("/performance", (req, res) => {

  const data = fs.readFileSync("metrics.txt", "utf8")
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map(l => {
      const [model, rmse, mae, deltaR] = l.split(",");
      return {
        model,
        rmse: parseFloat(rmse),
        mae: parseFloat(mae),
        deltaR: parseFloat(deltaR)
      };
    });

  res.json(data);
});

app.get("/history", async (req, res) => {
  const data = await Prediction.find().sort({ createdAt: -1 });
  res.json(data);
});

app.listen(5000, () => console.log("Server running → http://localhost:5000"));