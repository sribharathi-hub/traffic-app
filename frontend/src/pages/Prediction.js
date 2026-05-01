import { useState } from "react";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import "./Prediction.css"; // Import the CSS file below

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Prediction() {
  const nav = useNavigate();
  const [values, setValues] = useState({ f1: "", f2: "", f3: "", f4: "", f5: "" });
  const [results, setResults] = useState([]);

  const runPrediction = async () => {
    if (Object.values(values).some(v => v === "")) {
      alert("Enter all values");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Prediction error:", e);
    }
  };

  const avg = results.length > 0
    ? results.reduce((s, r) => s + r.value, 0) / results.length
    : 0;

  const getTraffic = (v) => {
    if (v < 1) return "HIGH";
    if (v < 5) return "MEDIUM";
    return "LOW";
  };

  return (
    <div className="prediction-page">
      <button className="back-btn-corner" onClick={() => nav("/dashboard")}>
        ← BACK
      </button>

      {/* Left Column: Input Form */}
      <div className="glass-card input-container">
        <h2 className="neon-text">TRAFFIC PREDICTION</h2>
        <div className="vertical-form">
          {Object.keys(values).map(k => (
            <input
              key={k}
              className="glass-input"
              placeholder={`Feature ${k.slice(1)}`}
              value={values[k]}
              onChange={(e) => setValues({ ...values, [k]: Number(e.target.value) })}
            />
          ))}
        </div>
        <button className="predict-btn" onClick={runPrediction}>
          Predict Traffic
        </button>
      </div>

      {/* Right Column: Results and Chart */}
      <div className="results-container">
        {results.length > 0 && (
          <div className="results-inner">
            <div className="stats-list">
              {results.map(r => (
                <div className="mini-card" key={r.model}>
                  <span>{r.model}</span>
                  <strong>{r.deltaR.toFixed(4)}</strong>
                </div>
              ))}
            </div>

            <div className="summary-section">
              <div className="avg-display">Avg: {avg.toFixed(4)}</div>
              <div className={`status-card ${getTraffic(avg).toLowerCase()}`}>
                {getTraffic(avg)} TRAFFIC
              </div>
            </div>

            <div className="chart-box">
              <Bar
                data={{
                  labels: results.map(r => r.model),
                  datasets: [{
                    label: "Prediction",
                    data: results.map(r => r.deltaR),
                    backgroundColor: "rgba(108, 99, 255, 0.6)",
                    borderColor: "#6c63ff",
                    borderWidth: 2,
                    borderRadius: 8,
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { beginAtZero: true, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#888" } },
                    x: { grid: { display: false }, ticks: { color: "#888" } }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
