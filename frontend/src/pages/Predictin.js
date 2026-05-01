import { useState } from "react";
import { Bar } from "react-chartjs-2";
import API from "./api";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Prediction() {

  const nav = useNavigate();

  const [values, setValues] = useState({
    f1: "", f2: "", f3: "", f4: "", f5: ""
  });

  const [results, setResults] = useState([]);

  const runPrediction = async () => {

    if (Object.values(values).some(v => v === "")) {
      alert("Enter all values");
      return;
    }

    const res = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });

    const data = await res.json();

    setResults(Array.isArray(data) ? data : []);
  };

  const avg = results.length > 0
    ? results.reduce((sum, r) => sum + (r.value || 0), 0) / results.length
    : 0;

  const best = results.length > 0
    ? results.reduce((a, b) => a.deltaR < b.deltaR ? a : b)
    : null;

  const getTraffic = (v) => {
    if (v < 3) return "LOW";
    if (v < 6) return "MEDIUM";
    return "HIGH";
  };

  return (
    <div className="prediction-page">

      <div className="glass-card input-container">
        <h2>TRAFFIC PREDICTION</h2>

        <div className="vertical-form">
          {Object.keys(values).map(k => (
            <input
              key={k}
              className="glass-input"
              placeholder={k}
              value={values[k]}
              onChange={(e) =>
                setValues({ ...values, [k]: e.target.value })
              }
            />
          ))}
        </div>

        <button className="predict-btn" onClick={runPrediction}>
          Predict
        </button>
      </div>

      <div className="results-container">

        <div className="stats-grid">
          {results.map(r => (
            <div
              className={`mini-card ${best && r.model === best.model ? "best" : ""}`}
              key={r.model}
            >
              <span>{r.model}</span>
              <strong>{(r.value || 0).toFixed(4)}</strong>
              <small>ΔR: {(r.deltaR || 0).toFixed(4)}</small>
              {best && r.model === best.model && <div>🏆 BEST</div>}
            </div>
          ))}
        </div>

        {results.length > 0 && (
          <div className="avg-card">
            Average Prediction: {avg.toFixed(4)}
          </div>
        )}

        {results.length > 0 && (
          <div className={`status-card ${getTraffic(avg).toLowerCase()}`}>
            {getTraffic(avg)} TRAFFIC
          </div>
        )}

        {results.length > 0 && (
          <div className="chart-box">
            <Bar
              data={{
                labels: results.map(r => r.model),
                datasets: [
                  {
                    label: "Prediction",
                    data: results.map(r => r.value),
                    backgroundColor: "rgba(0,255,255,0.4)",
                    borderColor: "#00ffff",
                    borderWidth: 2
                  },
                  {
                    label: "DeltaR",
                    data: results.map(r => r.deltaR),
                    backgroundColor: "rgba(255,0,255,0.4)",
                    borderColor: "#ff00ff",
                    borderWidth: 2
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: "white" }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: "white" }
                  },
                  y: {
                    ticks: { color: "white" },
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        )}

      </div>

      <button className="back-btn-bottom" onClick={() => nav("/dashboard")}>
        BACK
      </button>

    </div>
  );
}