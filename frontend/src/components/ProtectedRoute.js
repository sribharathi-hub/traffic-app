import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  return localStorage.getItem("auth") === "true"
    ? children
    : <Navigate to="/" />;
}