require('dotenv').config();
const express  = require("express");
const cors     = require("cors");
const { exec } = require("child_process");
const fs       = require("fs");
const path     = require("path");
const mongoose = require("mongoose");
const Prediction = require("./model/Prediction");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

app.post("/predict", (req, res) => {
  try {
    const input   = JSON.stringify(req.body).replace(/"/g, '\\"');
    const jarPath = path.join(__dirname, "TrafficFlow.jar");

    exec(`java -jar "${jarPath}" predictSingle "${input}"`, async (err, stdout, stderr) => {
      if (err) {
        console.error("EXEC ERROR:", err);
        console.error("STDERR:", stderr);
        return res.status(500).json({ error: "Java execution failed" });
      }

      try {
        const lines = stdout.split("\n");
        const start = lines.findIndex(l => l.trim() === "RESULT_START");
        const end   = lines.findIndex(l => l.trim() === "RESULT_END");
        const full  = {};

        lines.slice(start + 1, end).forEach(line => {
          const [key, val] = line.split("|");
          if (key && val) full[key.trim()] = parseFloat(val.trim());
        });

        const avg = (full.XGB + full.ASE) / 2;

        const result = {
          XGB:        full.XGB,
          ASE:        full.ASE,
          avg:        avg,
          deltaR_XGB: Math.abs(full.XGB - avg),
          deltaR_ASE: Math.abs(full.ASE - avg)
        };

        await Prediction.create({ input: req.body, output: full });

        res.json(result);

      } catch (parseErr) {
        console.error("Parse error:", parseErr);
        res.status(500).json({ error: "Failed to parse JAR output" });
      }
    });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    res.status(500).json({ error: "Server crash" });
  }
});

app.get("/performance", (req, res) => {
  try {
    const metricsPath = path.join(__dirname, "metrics.txt");
    const data = fs.readFileSync(metricsPath, "utf8")
      .split("\n")
      .slice(1)
      .filter(Boolean)
      .map(l => {
        const [model, rmse, mae, deltaR] = l.split(",");
        return {
          model,
          rmse:   parseFloat(rmse),
          mae:    parseFloat(mae),
          deltaR: parseFloat(deltaR)
        };
      });
    res.json(data);
  } catch (e) {
    console.error("Metrics error:", e);
    res.status(500).json({ error: "Could not read metrics" });
  }
});

app.get("/history", async (req, res) => {
  try {
    const data = await Prediction.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    console.error("History error:", e);
    res.status(500).json({ error: "Could not fetch history" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));