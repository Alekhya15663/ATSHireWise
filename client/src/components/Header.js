import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role"); // 👈 get role

  const initials = name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleProfileClick = () => {
    if (role === "recruiter") {
      navigate("/recruiter-dashboard");
    } else {
      navigate("/applicant-dashboard");
    }
  };

  return (
    <header className="header-container">
      <h2 className="logo" onClick={() => navigate("/")}>
        HireWise <span>ATS</span>
      </h2>

      {!token ? (
        <div className="auth-links">
          <Link to="/register">Create account</Link>
          <Link to="/login">Login</Link>
        </div>
      ) : (
        <div className="user-block">
          <div className="avatar" onClick={handleProfileClick}>
            {initials}
          </div>

          <span className="username">{name}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  );
}
