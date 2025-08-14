import { useState } from "react";
import "../styles/job.css";

export default function JobPost() {
  const [job, setJob] = useState({
    title: "",
    description: "",
    location: "",
    salary_min: "",
    salary_max: "",
    skills: "",
    job_type: "",
    company: "",
    experience: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:`Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.msg || "Failed to post job");
        setSuccessMsg("");
      } else {
        setSuccessMsg("Job posted successfully!");
        setErrorMsg("");
        setJob({
          title: "",
          description: "",
          location: "",
          salary_min: "",
          salary_max: "",
          skills: "",
          job_type: "",
          company: "",
          experience: "",
        });
      }
    } catch (err) {
      console.error("Error posting job:", err);
      setErrorMsg("Error posting job");
      setSuccessMsg("");
    }
  };

  return (
    <div className="job-post-container">
      <form className="job-post-form" onSubmit={handleSubmit}>
        <h2>Post a New Job</h2>

        {successMsg && <p className="success-msg">{successMsg}</p>}
        {errorMsg && <p className="error-msg">{errorMsg}</p>}

        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            type="text"
            name="title"
            id="title"
            value={job.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input
            type="text"
            name="company"
            id="company"
            value={job.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="job_type">Job Type</label>
          <input
            type="text"
            name="job_type"
            id="job_type"
            placeholder="e.g. Full-Time, Part-Time"
            value={job.job_type}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={job.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={job.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="experience">Experience Required</label>
          <select
            name="experience"
            id="experience"
            value={job.experience}
            onChange={handleChange}
            required
          >
            <option value="">Select Experience</option>
            <option value="0-1 years">0-1</option>
            <option value="1-3 years">1-3</option>
            <option value="3-5 years">3-5</option>
            <option value="5+ years">5+</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="salary_min">Minimum Salary (LPA)</label>
          <input
            type="number"
            step="0.1"
            name="salary_min"
            id="salary_min"
            value={job.salaryMin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="salary_max">Maximum Salary (LPA)</label>
          <input
            type="number"
            step="0.1"
            name="salary_max"
            id="salary_max"
            value={job.salaryMax}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="skills">Required Skills</label>
          <input
            type="text"
            name="skills"
            id="skills"
            value={job.skills}
            onChange={handleChange}
            placeholder="e.g., React, Node"
            required
          />
        </div>

        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}