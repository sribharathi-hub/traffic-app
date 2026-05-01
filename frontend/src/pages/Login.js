import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");

  const login = () => {
    if (u === "admin" && p === "admin") {
      localStorage.setItem("auth", "true");
      nav("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <div className="glass-card login-card">
        <h2 className="neon-text">Welcome Back</h2>
        <p className="sub-text">Enter your credentials to continue</p>

        <div className="input-group">
          <label>Username</label>
          <input
            className="glass-input"
            placeholder="e.g. admin"
            onChange={e => setU(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            className="glass-input"
            type="password"
            placeholder="••••••••"
            onChange={e => setP(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={login}>Sign In</button>
      </div>
    </div>
  );
}
