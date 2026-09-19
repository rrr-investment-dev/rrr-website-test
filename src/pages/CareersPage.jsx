import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/careers.css";

// Configure base API URL matching backend port
const API_BASE_URL = "http://localhost:3000/api";

// --- Styled Inline SVG Icons ---
const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="meta-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="meta-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="arrow-right-svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

export default function CareersPage() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Filtering
  const [selectedDept, setSelectedDept] = useState("All");
  const [departments, setDepartments] = useState(["All"]);

  // Fetch active openings
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/website/careers`);
        if (response.data && Array.isArray(response.data.data)) {
          const fetchedJobs = response.data.data;
          setJobs(fetchedJobs);

          // Extract unique departments
          const depts = ["All", ...new Set(fetchedJobs.map(job => job.department).filter(Boolean))];
          setDepartments(depts);
        } else {
          setJobs([]);
          setDepartments(["All"]);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load careers:", err);
        setIsLoading(false);
      }
    };
    loadJobs();
  }, []);
  // Get job count by department
  const getJobCountByDept = (deptName) => {
    if (deptName === "All") return jobs.length;
    return jobs.filter(job => job.department === deptName).length;
  };

  // Filter jobs based on department
  const filteredJobs = selectedDept === "All"
    ? jobs
    : jobs.filter(job => job.department === selectedDept);

  return (
    <div className="careers-container">
      {/* ── Immersive Hero Section ── */}
      <div className="careers-hero">
        <span className="hero-eyebrow">Careers at RRR Investments</span>
        <h1 className="hero-title">Build the Future of Alternative Capital</h1>
        <p className="hero-subtext">
          Join a collective of sharp minds and steady hands. We work at the intersection of deep domain 
          expertise, rigorous strategy, and radical operational ownership to deliver enduring value.
        </p>
      </div>

      {/* ── Why Work with Us Section ── */}
      <div className="culture-section">
        <h2 className="culture-title">Why RRR Investments?</h2>
        <div className="culture-grid">
          <div className="culture-card">
            <div className="culture-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="culture-card-title">Radical Autonomy</h3>
            <p className="culture-card-text">
              We trust you to direct your own focus. We build small, highly aligned, elite squads that possess complete agency over execution.
            </p>
          </div>
          <div className="culture-card">
            <div className="culture-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="culture-card-title">Intellectual Rigor</h3>
            <p className="culture-card-text">
              We debate facts, not status. Conviction at RRR is earned through structured research, data integrity, and strict stress-testing.
            </p>
          </div>
          <div className="culture-card">
            <div className="culture-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="culture-card-title">Enduring Quality</h3>
            <p className="culture-card-text">
              We construct strategies and build solutions designed to withstand market shocks and drive long-term compound growth.
            </p>
          </div>
        </div>
      </div>

      {/* ── Open Roles Directory Header ── */}
      <div className="section-header" style={{ marginBottom: "20px" }}>
        <h2 className="careers-section-title">Open Positions</h2>
      </div>

      {!isLoading && jobs.length > 0 && departments.length > 1 && (
        <div className="careers-filter-wrapper">
          <div className="careers-filter-list">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`careers-filter-item ${selectedDept === dept ? "active" : ""}`}
              >
                <span>{dept}</span>
                <span className="careers-filter-count">{getJobCountByDept(dept)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="careers-cards-grid">
          {/* Skeleton Loaders */}
          {[1, 2, 3].map((num) => (
            <div key={num} className="job-card skeleton" style={{ height: "200px", border: "none" }}></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 24px", color: "#64748b", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "16px", fontWeight: "600", color: "#0f172a", marginBottom: "8px" }}>No active openings at the moment</p>
          <p style={{ fontSize: "14px" }}>Please check back later or send a spontaneous application to info@rrrinvestments.com</p>
        </div>
      ) : (
        <div className="careers-cards-grid">
          {/* Grid of Job Cards */}
          {filteredJobs.length === 0 ? (
            <div style={{ color: "#64748b", padding: "20px 0", gridColumn: "1 / -1", textAlign: "center" }}>No roles under this department.</div>
          ) : (
            filteredJobs.map((job) => (
              <Link to={`/careers/${job._id}`} key={job._id} className="job-card-link">
                <div className="job-card">
                  <div className="card-header-block">
                    <span className="hero-eyebrow" style={{ color: "#64748b", marginBottom: "4px", fontSize: "10px" }}>
                      {job.department}
                    </span>
                    <h3 className="job-card-title">{job.title}</h3>
                  </div>
                  
                  <p className="job-card-excerpt">
                    {job.description ? job.description.substring(0, 110) + "..." : ""}
                  </p>

                  <div className="job-card-meta">
                    <span className="meta-item"><PinIcon /> {job.location}</span>
                    <span className="meta-item"><ClockIcon /> {job.jobType}</span>
                    {job.education && (
                      <span className="meta-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="meta-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                        {job.education}
                      </span>
                    )}
                  </div>

                  <div className="job-card-footer">
                    <span className="view-role-btn">
                      View Position <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
