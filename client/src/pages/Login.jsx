import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/login.css"; 

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      const { role } = jwtDecode(t);
      navigate(role === "recruiter" ? "/recruiter-dashboard" : "/jobs");
    }
  }, [navigate]);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("token", data.token);
        const { role, name } = jwtDecode(data.token);
        localStorage.setItem("name", name);
        localStorage.setItem("role", role);

        navigate(role === "recruiter" ? "/recruiter-dashboard" : "/applicant-dashboard");
      } else {
        setMsg(data.msg || "Invalid credentials");
      }
    } catch {
      setMsg("Network error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-card">
          <h1>Login</h1>

          <form onSubmit={submit}>
            <label>Email</label>
            <input type="email" name="email" onChange={update} required />

            <label>Password</label>
            <input type="password" name="password" onChange={update} required />

            <button type="submit">Login</button>
            {msg && <p className="login-msg">{msg}</p>}
          </form>

          <p className="login-link-info">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}