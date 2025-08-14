import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

import Login                from "./pages/Login";
import Register             from "./pages/Register";
import JobPost              from "./pages/JobPost";
import JobList              from "./pages/JobList";
import Applicants           from "./pages/Applicants";
import RecruiterDashboard   from "./pages/RecruiterDashboard";
import AllJobs              from "./pages/AllJobs";
import Apply                from "./pages/Apply";
import MyApplications       from "./pages/MyApplications";
import ApplicantDashboard   from "./pages/ApplicantDashboard";

import Header               from "./components/Header";
import ProtectedRoute       from "./components/ProtectedRoute";
import RecruiterRoute       from "./components/RecruiterRoute";

import Landing              from "./pages/landing";


import "./App.css";
import "./styles/landing.css";
const Shell = () => (
  <div className="app-container">
    <main className="site-main">
      <Outlet />
    </main>
    <footer className="site-footer">
      &copy; {new Date().getFullYear()} HireWise · Built by Alekhya
    </footer>
  </div>
);

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const home = role === "recruiter" ? "/dashboard" : "/jobs";
  

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route element={<Shell />}>
          {/* ── Public Routes ── */}
          <Route index element={<Landing />} />
          <Route
            path="login"
            element={token ? <Navigate to={home} replace /> : <Login />}
          />
          <Route
            path="register"
            element={token ? <Navigate to={home} replace /> : <Register />}
          />
          <Route path="jobs" element={<AllJobs />} />
         

          {/* ── Applicant Routes ── */}
          <Route element={<ProtectedRoute />}>
            <Route path="apply/:jobId" element={<Apply />} />
            <Route path="my-applications" element={<MyApplications />} />
            <Route path="applicant-dashboard" element={<ApplicantDashboard />} />
          </Route>

          {/* ── Recruiter Routes ── */}
          <Route element={<RecruiterRoute />}>
            <Route path="post-job" element={<JobPost />} />
            <Route path="recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="jobs-internal" element={<JobList />} />
            <Route path="applications/:jobId" element={<Applicants />} />
          </Route>

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}