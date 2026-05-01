import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import "./Analytics.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Analytics() {
  const nav = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetching performance metrics from your backend
    fetch("http://localhost:5000/performance")
      .then((r) => r.json())
      .then((d) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="analytics-page">
      <div className="glass-card comparison-container">

        <h2 className="neon-title">MODEL COMPARISON ANALYSIS</h2>

        {/* Chart Section */}
        <div className="chart-box-large">
          <Bar
            data={{
              labels: data.map((d) => d.model),
              datasets: [
                {
                  label: "Accuracy Score (R²)",
                  data: data.map((d) => d.deltaR),
                  backgroundColor: "rgba(51, 246, 175, 0.2)",
                  borderColor: "#33f6af",
                  borderWidth: 2,
                  borderRadius: 5,
                  hoverBackgroundColor: "#33f6af",
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { labels: { color: "#fff", font: { size: 12 } } },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: "#33f6af",
                    callback: (v) => v.toFixed(1) // Makes labels cleaner
                  },
                  grid: { color: "rgba(255, 255, 255, 0.05)" },
                },
                x: {
                  ticks: {
                    color: "#fff",
                    maxRotation: 45,
                    minRotation: 45
                  },
                  grid: { display: false },
                },
              },
            }}

          />
        </div>

        {/* Metrics Table Section */}
        <div className="metrics-table-wrapper">
          <table className="neon-table">
            <thead>
              <tr>
                <th>MODEL</th>
                <th>RMSE</th>
                <th>MAE</th>
                <th>R² ACCURACY</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.model}>
                  <td className="model-name-cell">{d.model}</td>
                  <td>{d.rmse.toFixed(4)}</td>
                  <td>{d.mae.toFixed(4)}</td>
                  <td className="highlight-r2">
                    {(d.deltaR * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Navigation Button */}
        <button
          className="back-btn-center"
          onClick={() => nav("/dashboard")}
        >
          ← BACK TO DASHBOARD
        </button>
      </div>
    </div>
  );
}
