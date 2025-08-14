import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMapPin, FiDollarSign, FiTool, FiBriefcase} from "react-icons/fi";
import "../styles/alljobs.css";

export default function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:4000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error("Job fetch error:", err));
  }, []);

  const goToApply = (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
    } else {
      navigate(`/apply/${jobId}`);
    }
  };

  return (
    <div className="jobs-page">
      <h2 className="jobs-title">Explore Jobs</h2>

      <div className="jobs-wrapper">
        {jobs.length === 0 ? (
          <p>No jobs available right now.</p>
        ) : (
          jobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h3>{job.title}</h3>
              
              <div className="job-company">
                <p>{job.company}</p>
              </div>
              <p>{job.description}...</p>
              <p>
                <FiMapPin className="icon" />
                <strong>Location:</strong> {job.location}</p>
                <p>
                <FiBriefcase className="icon" />
                <strong> Experience:</strong> {job.experience}
              </p>
              <p>
                <strong>
                  <FiDollarSign className="icon" />
                  Salary:</strong> ₹{job.salary_min}LPA
                {job.salary_max && job.salary_max !== job.salary_min
                  ? ` - ₹${job.salary_max}LPA`
                  : ""}
              </p>
              <p>
                <FiTool className="icon" />
                <strong>Skills:</strong> {job.skills}</p>
              <button onClick={() => goToApply(job.id)}>Apply</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
