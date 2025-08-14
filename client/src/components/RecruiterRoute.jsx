
import { Navigate, Outlet } from "react-router-dom";

export default function RecruiterRoute() {
  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  return token && role === "recruiter" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}