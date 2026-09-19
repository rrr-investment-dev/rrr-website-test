import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/careers.css";

// Configure base API URL matching backend port
const API_BASE_URL = "http://localhost:3000/api";

// --- Styled Inline SVG Icons ---
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="back-icon-svg">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

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

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="meta-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 0-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const EducationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="meta-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="meta-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="list-check-icon">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/website/careers`);
        if (response.data && Array.isArray(response.data.data)) {
          const matched = response.data.data.find(j => j._id === id);
          setJob(matched || null);
        } else {
          setJob(null);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load job details:", err);
        setIsLoading(false);
      }
    };
    loadJob();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData((prev) => ({ ...prev, resume: file }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files ? e.dataTransfer.files[0] : null;
    if (file) {
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (['pdf', 'doc', 'docx'].includes(fileExt)) {
        setFormData((prev) => ({ ...prev, resume: file }));
      } else {
        alert("Please upload a PDF or Word document.");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.resume) {
      alert("Please upload your resume file.");
      return;
    }

    setIsSubmitting(true);
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("email", formData.email);
    submitData.append("phone", formData.phone);
    submitData.append("coverLetter", formData.coverLetter);
    submitData.append("resume", formData.resume);

    try {
      await axios.post(
        `${API_BASE_URL}/website/careers/${id}/apply`,
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsSuccess(true);
      setFormData({ name: "", email: "", phone: "", coverLetter: "", resume: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <div className="careers-container details-page-loading">
        <button onClick={() => navigate("/careers")} className="back-link">
          <BackIcon /> <span>Back to Open Positions</span>
        </button>
        <div className="job-details-pane skeleton" style={{ height: "450px", border: "none", marginTop: "24px" }}></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="careers-container details-page-error">
        <button onClick={() => navigate("/careers")} className="back-link">
          <BackIcon /> <span>Back to Open Positions</span>
        </button>
        <div style={{ textAlign: "center", padding: "80px 24px", color: "#64748b", marginTop: "24px" }}>
          <h2 style={{ color: "#0f172a", marginBottom: "8px", fontWeight: "800" }}>Opening Not Found</h2>
          <p>The job opening you are looking for does not exist or has been closed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="careers-container details-page-wrapper">
      {/* ── Back Navigation ── */}
      <button onClick={() => navigate("/careers")} className="back-link">
        <BackIcon /> <span>Back to Open Positions</span>
      </button>

      {/* ── Job Details Document ── */}
      <div className="job-details-document">
        {/* Header Block */}
        <div className="details-doc-header">
          <span className="hero-eyebrow" style={{ marginBottom: "8px" }}>
            {job.department}
          </span>
          <h1 className="details-doc-title">{job.title}</h1>
          
          <div className="details-doc-specs">
            <span className="meta-item"><BuildingIcon /> {job.department}</span>
            <span className="meta-item"><PinIcon /> {job.location}</span>
            <span className="meta-item"><ClockIcon /> {job.jobType}</span>
            <span className="meta-item"><BriefcaseIcon /> {job.experience}</span>
            {job.education && (
              <span className="meta-item"><EducationIcon /> {job.education}</span>
            )}
          </div>

          <button onClick={scrollToForm} className="apply-button-header" style={{ marginTop: "24px" }}>
            Apply Now
          </button>
        </div>

        {/* Content Body */}
        <div className="details-doc-body">
          <div className="details-doc-section">
            <h2>About the Role</h2>
            <p className="details-description">{job.description}</p>
          </div>

          {job.requirements?.length > 0 && (
            <div className="details-doc-section">
              <h2>Requirements</h2>
              <ul className="details-list">
                {job.requirements.map((req, idx) => (
                  <li key={idx}>
                    <CheckCircleIcon />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits?.length > 0 && (
            <div className="details-doc-section">
              <h2>Benefits & Perks</h2>
              <ul className="details-list">
                {job.benefits.map((ben, idx) => (
                  <li key={idx}>
                    <CheckCircleIcon />
                    <span>{ben}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Inline Apply Form Section ── */}
        <div ref={formRef} className="details-apply-section">
          <div className="apply-section-header">
            <h2>Apply for this position</h2>
            <p>Complete the form below and upload your CV profile to submit your application.</p>
          </div>

          {isSuccess ? (
            <div className="apply-success-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="success-check-svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>Application Submitted</h3>
              <p>
                Thank you for applying. We have received your profile details and resume file. Our hiring team will review it and get in touch with you shortly.
              </p>
              <button onClick={() => navigate("/careers")} className="back-link" style={{ marginTop: "16px", background: "transparent", border: "none", cursor: "pointer", color: "#00338D", fontWeight: "700" }}>
                Browse other openings
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="app-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. john.doe@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g. +91 98765 43210"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Cover Letter / Notes (Optional)</label>
                <textarea
                  name="coverLetter"
                  rows={4}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Describe why you are a good fit for this role..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Resume (PDF, Word)</label>
                {formData.resume ? (
                  <div className="selected-file-badge">
                    <div className="selected-file-info">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="selected-file-name">{formData.resume.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, resume: null }))}
                      className="remove-file-btn"
                      title="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div
                    className={`resume-dropzone ${isDragActive ? "active" : ""}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("resume-upload").click()}
                  >
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="dropzone-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="dropzone-text">
                      Drag and drop your resume here, or <span style={{ color: "#00338D", textDecoration: "underline" }}>browse</span>
                    </span>
                    <span className="dropzone-subtext">Supports PDF, DOC, DOCX up to 10MB</span>
                  </div>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} className="form-submit-btn">
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  "Submit Application"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
