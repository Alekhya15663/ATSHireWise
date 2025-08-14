import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function RecruiterDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editJob, setEditJob] = useState({
    title: "",
    description: "",
    location: "",
    experience: "",
    salary_min: "",
    salary_max: "",
    skills: "",
    job_type: "",
    company: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:4000/jobs/my-jobs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Auth error");
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch(() => alert("Could not load jobs"));
  }, [navigate, token]);

  const saveEdit = async (jobId) => {
    const res = await fetch(`http://localhost:4000/jobs/${jobId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editJob),
    });

    if (res.ok) {
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, ...editJob } : j))
      );
      setEditId(null);
    } else {
      alert("Failed to update job");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;

    const res = await fetch(`http://localhost:4000/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    } else {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="dashboard">
      <h2>Welcome Back, Recruiter!</h2>

      <div style={{ marginBottom: "20px" }}>
        <Link to="/post-job">
          <button className="primary-btn">+ Post a New Job</button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="no-jobs">
          <p>No jobs posted yet.</p>
          <p>You can start by posting your first job above.</p>
        </div>
      ) : (
        jobs.map((job) => (
          <div key={job.id} className="job-card">
            {editId === job.id ? (
              <>
                <input
                  value={editJob.title}
                  placeholder="Title"
                  onChange={(e) =>
                    setEditJob({ ...editJob, title: e.target.value })
                  }
                />
                <textarea
                  value={editJob.description}
                  placeholder="Description"
                  onChange={(e) =>
                    setEditJob({ ...editJob, description: e.target.value })
                  }
                />
                <input
                  value={editJob.location}
                  placeholder="Location"
                  onChange={(e) =>
                    setEditJob({ ...editJob, location: e.target.value })
                  }
                />
               <select
  className="form-control"
  value={editJob.experience}
  onChange={(e) =>
    setEditJob({ ...editJob, experience: e.target.value })
  }
>
  <option value="">Select experience</option>
  <option value="0-1 years">0-1</option>
  <option value="1-3 years">1-3</option>
  <option value="3-5 years">3-5</option>
  <option value="5+ years">5+</option>
</select>

                <input
                  type="number"
                  value={editJob.salary_min}
                  placeholder="Minimum Salary (LPA)"
                  onChange={(e) =>
                    setEditJob({ ...editJob, salary_min: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editJob.salary_max}
                  placeholder="Maximum Salary (LPA)"
                  onChange={(e) =>
                    setEditJob({ ...editJob, salary_max: e.target.value })
                  }
                />
                <input
                  value={editJob.skills}
                  placeholder="Skills (comma-separated)"
                  onChange={(e) =>
                    setEditJob({ ...editJob, skills: e.target.value })
                  }
                />
                <input
                  value={editJob.job_type}
                  placeholder="Job Type (Full-time, Part-time, etc.)"
                  onChange={(e) =>
                    setEditJob({ ...editJob, job_type: e.target.value })
                  }
                />
                <input
                  value={editJob.company}
                  placeholder="Company Name"
                  onChange={(e) =>
                    setEditJob({ ...editJob, company: e.target.value })
                  }
                />

                <button onClick={() => saveEdit(job.id)}>Save</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{job.title}</h3>
                <div className="job-field">
                  <span className="label"><strong>Company:</strong></span>
                  <span className="value">{job.company}</span>
                </div>
                <div className="job-field">
                  <span className="label"><strong>Description:</strong></span>
                  <span className="value">{job.description}</span>
                </div>
                <div className="job-field">
                  <span className="label"><strong>Location:</strong></span>
                  <span className="value">{job.location}</span>
                </div>
                <div className="job-field">
                  <span className="label"><strong>Experience:</strong></span>
                  <span className="value">{job.experience}</span>
                </div>
                <div className="job-field">
                  <span className="label"><strong>Salary:</strong></span>
                  <span className="value">₹{job.salary_min} - ₹{job.salary_max} LPA</span>
                </div>
                <div className="job-field">
                  <span className="label"><strong>Skills:</strong></span>
                  <span className="value">{job.skills}</span>
                </div>
                <div className="job-field">
                  <span className="label"><strong>Job Type:</strong></span>
                  <span className="value">{job.job_type}</span>
                </div>

                <Link to={`/applications/${job.id}`}>👥 View Applicants</Link>

                <div className="action-buttons">
                  <button
                    onClick={() => {
                      setEditId(job.id);
                      setEditJob({
                        title: job.title,
                        description: job.description,
                        location: job.location,
                        experience: job.experience,
                        salary_min: job.salary_min,
                        salary_max: job.salary_max,
                        skills: job.skills,
                        job_type: job.job_type,
                        company: job.company,
                      });
                    }}
                  >
                    ✏ Edit
                  </button>
                  <button onClick={() => deleteJob(job.id)}>🗑 Delete</button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
