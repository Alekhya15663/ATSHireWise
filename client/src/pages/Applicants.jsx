
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/applicants.css";

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/applications/${jobId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authorised or server error");
        return res.json();
      })
      .then((data) => {
        setApps(data);
        setLoading(false);
      })
      .catch((e) => {
        setErr(e.message);
        setLoading(false);
      });
  }, [jobId]);

  const updateStatus = async (appId, newStatus) => {
  try {
    const res = await fetch(`http://localhost:4000/applications/${appId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization:`Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ status: newStatus })
    });

    if (res.ok) {
      setApps((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    } else {
      alert("Could not update status");
    }
  } catch (error) {
    console.error("Failed to update status", error);
  }
};
 
  if (loading) return <p style={{ textAlign: "center" }}>Loading…</p>;
  if (err)   return <p style={{ textAlign: "center", color: "crimson" }}>{err}</p>;

  return (
    <div className="applicants-wrapper">
      <h2>Applicants for Job #{jobId}</h2>

      {apps.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul>
  {apps.map((app) => (
    <li key={app.id}>
      <strong>{app.full_name}</strong>
      <br />
      Username: {app.applicant_name} 
      <br />
      Email: {app.applicant_email}
      <br />
      Phone: {app.phone}
      <br />
      <a
        href={`http://localhost:4000/uploads/${app.resume_file}`}
        target="_blank"
        rel="noreferrer"
      >
        Resume
      </a>
      <select
        value={app.status}
        onChange={(e) => updateStatus(app.id, e.target.value)}
      >
        <option value="Pending">Pending</option>
        <option value="Short-Listed">Short-Listed</option>
        <option value="Rejected">Rejected</option>
      </select>
      <span style={{ fontSize: "0.8rem", marginLeft: "0.5rem" }}>
        · {new Date(app.applied_at).toLocaleString()}
      </span>
    </li>
  ))}
</ul>

      )}
    </div>
  );
}