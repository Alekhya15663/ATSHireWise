import { useEffect, useState } from "react";
import "../styles/jobs.css";

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showApplyId, setShowApplyId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    resume: null,
  });

  const [filters] = useState({
    location: "",
    jobType: "",
    company: "",
    keyword: "",
  });

  useEffect(() => {
    const query = new URLSearchParams(
      Object.entries(filters).filter(([_, value]) => value.trim() !== "")
    ).toString();

    fetch(`http://localhost:4000/jobs?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch(() => {
        setErr("Could not load jobs");
        setLoading(false);
      });
  }, [filters]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, resume: e.target.files[0] });
  };

  const handleApplySubmit = async (e, jobId) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("applicant_name", form.name);
    formData.append("applicant_email", form.email);
    formData.append("resume", form.resume);

    try {
      const res = await fetch(`http://localhost:4000/applications/${jobId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      alert(data.msg);

      setForm({ name: "", email: "", resume: null });
      setShowApplyId(null);
    } catch (err) {
      alert("Something went wrong while applying.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading jobs…</p>;
  if (err) return <p style={{ textAlign: "center", color: "crimson" }}>{err}</p>;

  return (
  <div className="jobs-wrapper">
    {/* Job List */}
    <div className="jobs-container">
      {jobs.map((job) => (
  <div key={job.id} className="job-card">
    <h2>
      {job.title}
    </h2>

          <div className="job-meta">
            {job.location} &nbsp;|&nbsp; {job.salary_min} - {job.salary_max} LPA
          </div>
          <div className="job-desc">
            {job.description}...
          </div>
          <div className="job-tags">
            {job.skills.split(",").map((s, idx) => (
              <span key={idx} className="job-tag">{s.trim()}</span>
            ))}
          </div>

          {showApplyId === job.id ? (
            <>
              <div className="job-apply-details">
                <h3>Apply for {job.title}</h3>
                <p><strong>Description:</strong> {job.description}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Salary:</strong> ₹{parseFloat(job.salary_min).toFixed(1)} LPA
                {job.salary_max && job.salary_max !== job.salary_min
                ? ` - ₹${parseFloat(job.salary_max).toFixed(1)} LPA` : ""}</p>


                <p><strong>Skills:</strong> {job.skills}</p>
              </div>

              <form
                className="apply-form"
                onSubmit={(e) => handleApplySubmit(e, job.id)}
                encType="multipart/form-data"
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
                <button type="submit">Submit</button>
              </form>
            </>
          ) : (
            <button onClick={() => setShowApplyId(job.id)}>Apply</button>
          )}
        </div>
      ))}
    </div>
  </div>
);
}
