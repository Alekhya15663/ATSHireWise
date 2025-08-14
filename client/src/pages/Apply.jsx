import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/apply.css";

export default function Apply() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [pitch, setPitch] = useState("");

  useEffect(() => {
    fetch(`http://localhost:4000/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch(() => setStatus("Error loading job"));
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return setStatus("Please upload your resume");

    const token = localStorage.getItem("token");
    if (!token) {
      setStatus("You must be logged in to apply.");
      return;
    }

    const formData = new FormData();
    formData.append("applicant_name", fullName);
    formData.append("applicant_email", email);
    formData.append("resume", resume);
    formData.append("phone", phone);
    formData.append("graduation_year", gradYear);
    formData.append("college", college);
    formData.append("degree", degree);
    formData.append("branch", branch);
    formData.append("linkedin", linkedin);
    formData.append("github", github);
    formData.append("pitch", pitch);

    try {
      const res = await fetch(
        `http://localhost:4000/applications/apply/${jobId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStatus("Application submitted!");
        setTimeout(() => navigate("/jobs"), 1500);
      } else {
        setStatus(data.msg || "Something went wrong.");
        console.error("Error submitting:", data);
      }
    } catch (err) {
      setStatus("Failed to apply.");
      console.error("Network error:", err);
    }
  };

  return (
    <div className="apply-container">
      <h2>Apply for Job</h2>
      {job ? (
        <div className="job-details">
          <h3>{job.title}</h3>
          <form onSubmit={handleSubmit} className="application-form">
            <input
  type="text"
  placeholder="Full Name"
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  required
/>
<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <input
  type="number"
  placeholder="Graduation Year"
  value={gradYear}
  onChange={(e) => setGradYear(e.target.value)}
  min="2000"
  max="2030"
  required
/>

            <input
              type="text"
              placeholder="College"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Branch"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            />
            <input
              type="url"
              placeholder="LinkedIn Profile"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <input
              type="url"
              placeholder="GitHub Profile"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
            />
            <textarea
              placeholder="Short pitch about yourself"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              rows={4}
            ></textarea>

            <label>Upload Resume:</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              required
            />

            <button type="submit">Submit Application</button>
          </form>

          {status && <p className="status-msg">{status}</p>}
        </div>
      ) : (
        <p>Loading job details...</p>
      )}
    </div>
  );
}
