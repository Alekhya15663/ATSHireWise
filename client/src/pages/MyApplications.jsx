import { useEffect, useState } from "react";
import "../styles/myapps.css";

export default function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your applications.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:4000/applications/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 403) throw new Error("Forbidden");
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setError("Failed to load your applications.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;

  return (
    <div className="myapps-wrapper">
      <h2>My Applications</h2>

      {error ? (
        <p className="error-msg" style={{ color: "crimson" }}>{error}</p>
      ) : apps.length === 0 ? (
        <p>You haven’t applied to any jobs yet.</p>
      ) : (
        <ul>
          {apps.map((app) => (
            <li key={app.id} className="app-item">
              <h3>{app.title}</h3>
              <p>
                {app.location} &nbsp;|&nbsp; ₹{app.salary} LPA
              </p>
              <p>
                Status: <strong>{app.status}</strong> &nbsp;·&nbsp;
                Applied {new Date(app.applied_at).toLocaleDateString()}
              </p>
              <a
                href={`http://localhost:4000/uploads/${app.resume_file}`}
                target="_blank"
                rel="noreferrer"
              >
                View Resume
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
