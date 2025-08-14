import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "applicant",
  });

  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
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

        setSuccess(true);

        setTimeout(() => {
          navigate(role === "recruiter" ? "/recruiter-dashboard" : "/jobs");
        }, 2000);
      } else {
        setMsg(data.msg || "Something went wrong!");
      }
    } catch {
      setMsg("Network error!");
    }
  };

  return (
    <div className="fullscreen-register">
      <div className="auth-card">
        {success ? (
          <div className="success-msg">
            <div className="check-icon"></div>
            <h2>Registration Complete</h2>
            <p>Your account has been successfully created.</p>
            <p>Redirecting to your dashboard...</p>
          </div>
        ) : (
          <>
            <h2>Create Account</h2>
            <form onSubmit={submit}>
              <label>Full Name</label>
              <input type="text" name="name" onChange={update} required />

              <label>Email</label>
              <input type="email" name="email" onChange={update} required />

              <label>Password</label>
              <input type="password" name="password" onChange={update} required />

              <label>Register as</label>
              <select name="role" value={form.role} onChange={update}>
                <option value="applicant">Applicant</option>
                <option value="recruiter">Recruiter</option>
              </select>

              <button type="submit">Register</button>
              {msg && <p className="msg">{msg}</p>}
            </form>

            <p className="link-info">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}