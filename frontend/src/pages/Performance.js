import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Performance.css"; // Ensure this import is here

export default function Performance() {
  const nav = useNavigate();
  const [data, setData] = useState([]);

  const format = (v) => (v != null ? v.toFixed(4) : "0.0000");

  useEffect(() => {
    fetch("http://localhost:5000/performance")
      .then(r => r.json())
      .then(d => {
        setData(Array.isArray(d) ? d : []);
      })
      .catch(() => setData([]));
  }, []);

  return (
    <div className="performance-page">
      <div className="performance-header-box">
        <h2 className="neon-text-green">MODEL PERFORMANCE</h2>
        <p className="sub-header-green">Detailed error metrics across all trained models</p>
      </div>

      <div className="performance-grid-3col">
        {data.map((d) => (
          <div className="glass-card mini-performance-card" key={d.model}>
            <div className="model-header">
              <span className="model-name">{d.model}</span>
            </div>

            <div className="metric-content">
              <div className="metric-line">
                <span>RMSE:</span> <strong>{format(d.rmse)}</strong>
              </div>

              <div className="metric-line">
                <span>MAE:</span> <strong>{format(d.mae)}</strong>
              </div>

              <div className="metric-line highlight">
                <span>DeltaR:</span> <strong>{format(d.deltaR)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="green-neon-btn"
        onClick={() => nav("/dashboard")}
      >
        ⬅ BACK TO DASHBOARD
      </button>
    </div>
  );
}
