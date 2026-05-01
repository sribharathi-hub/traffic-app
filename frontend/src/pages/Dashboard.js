import { useNavigate } from "react-router-dom";
import { MdTimeline, MdBarChart, MdCompareArrows } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import "./Dashboard.css";

export default function Dashboard() {
  const nav = useNavigate();

  const cards = [
    { title: "Prediction", desc: "Predict traffic levels using advanced machine learning models.", path: "/prediction", color: "cyan", icon: <MdTimeline /> },
    { title: "Performance", desc: "View model performance metrics and evaluation results.", path: "/performance", color: "green", icon: <AiOutlineDashboard /> },
    { title: "Analytics", desc: "Explore traffic trends and patterns with interactive visualizations.", path: "/analytics", color: "purple", icon: <MdBarChart /> },
    { title: "Comparison", desc: "Compare all models and find the best performing algorithm.", path: "/comparison", color: "yellow", icon: <MdCompareArrows /> },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="main-title">🚥 TRAFFIC PREDICTION APP</h1>
        <p className="sub-header">Smart Hybrid Traffic Flow Prediction & Analysis System</p>
      </header>

      <div className="dashboard-grid-2col">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`nav-card ${card.color}`}
            onClick={() => nav(card.path)}
          >
            <div className="icon-wrapper">{card.icon}</div>
            <div className="card-content">
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
            <div className="arrow-btn">→</div>
          </div>
        ))}
      </div>
    </div>
  );
}
