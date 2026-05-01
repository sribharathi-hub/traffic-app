import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import "./Comparison.css";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
);
export default function Comparison() {

  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    fetch("http://localhost:5000/performance")
      .then(r => r.json())
      .then(d => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]));
  }, []);

  const ASE = data.find(m => m.model === "ASE") || { rmse: 0, mae: 0, deltaR: 0 };
  const others = data.filter(m => m.model !== "ASE");

  const currentModel = others[index] || {
    model: "Loading...",
    rmse: 0,
    mae: 0,
    deltaR: 0
  };

  const nextModel = () => {
    if (others.length === 0) return;
    setIndex((prev) => (prev + 1) % others.length);
  };

  const chartData = {
    labels: ["RMSE", "MAE", "DeltaR"],
    datasets: [
      {
        label: "ASE",
        data: [ASE.rmse, ASE.mae, ASE.deltaR],
        backgroundColor: "rgba(255,255,255,0.1)",
        borderColor: "#ffffff",
        borderWidth: 2
      },
      {
        label: currentModel.model,
        data: [currentModel.rmse, currentModel.mae, currentModel.deltaR],
        backgroundColor: "rgba(255,234,0,0.4)",
        borderColor: "#ffea00",
        borderWidth: 3
      }
    ]
  };

  const scatterData = {
    datasets: [
      {
        label: "ASE",
        data: [{ x: ASE.rmse, y: ASE.deltaR }],
        backgroundColor: "#fff",
        pointRadius: 10
      },
      {
        label: currentModel.model,
        data: [{ x: currentModel.rmse, y: currentModel.deltaR }],
        backgroundColor: "#ffea00",
        pointRadius: 15
      }
    ]
  };

  return (
    <div className="page-container">
      <div className="main-content">
        <div className="glass-card comparison-container">

          <h2 className="neon-orange">ASE vs {currentModel.model}</h2>

          <p className="tap-hint">
            Tap graph to switch model ({others.length === 0 ? 0 : index + 1}/{others.length})
          </p>

          <div className="button-group">
            {["bar", "line", "scatter"].map(type => (
              <button
                key={type}
                className={`tab-btn ${chartType === type ? "active" : ""}`}
                onClick={() => setChartType(type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div
            className="chart-box-large"
            onClick={nextModel}
            style={{ cursor: "pointer" }}
          >

            {chartType === "bar" && <Bar data={chartData} />}
            {chartType === "line" && <Line data={chartData} />}
            {chartType === "scatter" && (
              <Scatter
                data={scatterData}
                options={{
                  scales: {
                    x: { title: { display: true, text: "RMSE", color: "#fff" } },
                    y: { title: { display: true, text: "DeltaR", color: "#fff" } }
                  }
                }}
              />
            )}

          </div>

          <div className="metrics-table-wrapper">

            <table className="neon-table">

              <thead>
                <tr>
                  <th>METRIC</th>
                  <th>ASE</th>
                  <th>{currentModel.model}</th>
                  <th>DIFF</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td>RMSE</td>
                  <td>{ASE.rmse.toFixed(4)}</td>
                  <td>{currentModel.rmse.toFixed(4)}</td>
                  <td style={{ color: currentModel.rmse < ASE.rmse ? "#39ff14" : "#ff3131" }}>
                    {(currentModel.rmse - ASE.rmse).toFixed(4)}
                  </td>
                </tr>

                <tr>
                  <td>MAE</td>
                  <td>{ASE.mae.toFixed(4)}</td>
                  <td>{currentModel.mae.toFixed(4)}</td>
                  <td style={{ color: currentModel.mae < ASE.mae ? "#39ff14" : "#ff3131" }}>
                    {(currentModel.mae - ASE.mae).toFixed(4)}
                  </td>
                </tr>

                <tr>
                  <td>DeltaR</td>
                  <td>{ASE.deltaR.toFixed(4)}</td>
                  <td>{currentModel.deltaR.toFixed(4)}</td>
                  <td style={{ color: currentModel.deltaR < ASE.deltaR ? "#39ff14" : "#ff3131" }}>
                    {(currentModel.deltaR - ASE.deltaR).toFixed(4)}
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

          <button
            className="back-btn-bottom orange-neon-btn"
            onClick={() => nav("/dashboard")}
          >
            ⬅ BACK TO DASHBOARD
          </button>

        </div>
      </div>
    </div>
  );
}