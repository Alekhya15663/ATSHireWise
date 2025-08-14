import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

export default function ApplicantDashboard() {
  const name = localStorage.getItem("name");
  const navigate = useNavigate();

  return (
    <main className="dashboard-main">
      <div className="dashboard-card">
        <h2>Welcome, {name}!</h2>
        <p>This is your personal dashboard.</p>

        <div className="dashboard-buttons">
          <button onClick={() => navigate("/jobs")}>View All Jobs</button>
          <button onClick={() => navigate("/my-applications")}>My Applications</button>
          
        </div>
      </div>
    </main>
  );
}
