
import React from "react";
import "../styles/landing.css";

const Landing = () => (
  <section className="landing"
    style={{
       backgroundImage:"url('ATS.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        positon:"relative",

    }}
    >
      {/*Dark overlay*/}
      <div className="overlay"></div>
    <div className="landing-inner">
      <div className="landing-left">
        <h1>Recruit Smarter, Not Harder</h1>
        <p>
          <em>HireWise ATS helps recruiters streamline hiring — track applicants, manage resumes,
          and make data-driven decisions effortlessly.</em>
        </p>

        <p className="feature-list">
          ✔ Post and manage job listings with ease<br/>
          ✔ Track applications in real-time<br/>
          ✔ Secure resume management<br/>
          ✔ Intuitive dashboard for both roles
        </p>

        <div className="about-project">
          <h2>About HireWise</h2>
          <p>
            <em>Our goal is to connect talent with opportunity efficiently and effectively.</em><br/>
           HireWise is a streamlined recruitment platform built to simplify the hiring process for both companies and 
           job seekers.
              
          </p>
        </div>

        <div className="testimonials">
          <h2>How it Works?</h2>
          <ul>
            <li>Recruiters register and post jobs</li>
            <li>Apllicants browse and apply with resume</li>
            <li>Recruiters review applications and update status</li>
            <li>Both parties manage their dashboards</li>
          </ul>
          <button className="get-started-btn" onClick={()=>window.location.href="/register"}>
            Get Started
          </button>
        </div>

      </div>
    </div>
  </section>
);

export default Landing;