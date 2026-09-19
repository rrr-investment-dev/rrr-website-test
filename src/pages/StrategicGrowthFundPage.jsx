import { useState, useEffect, useRef } from "react";
import DiscoveryCallForm from "@/components/DiscoveryCallForm";
import "@/styles/offerings.css";

const STRATEGIC_THEMES = [
  {
    id: "01",
    title: "DeepTech & Enterprise SaaS",
    desc: "Scalable AI-native platforms, enterprise workflow automation, and mission-critical cloud infrastructure.",
    badge: "Enterprise",
  },
  {
    id: "02",
    title: "Fintech & Financial Infrastructure",
    desc: "Next-generation payments, digital credit underwriting, wealth infrastructure, and regulatory tech.",
    badge: "Finance",
  },
  {
    id: "03",
    title: "Consumer Brands & Retail Tech",
    desc: "High-retention omnichannel consumer brands, supply chain digitalization, and modern lifestyle products.",
    badge: "Consumer",
  },
  {
    id: "04",
    title: "Healthcare & Life Sciences",
    desc: "Digital diagnostics, specialty care distribution, clinical management platforms, and medical technology.",
    badge: "Healthcare",
  },
  {
    id: "05",
    title: "CleanTech & Advanced Manufacturing",
    desc: "Energy transition, precision engineering, EV ecosystem components, and sustainable industrial solutions.",
    badge: "Industrial",
  },
];

export default function StrategicGrowthFundPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isThemesModalOpen, setIsThemesModalOpen] = useState(false);
  const canvasRef = useRef(null);

  // Prevent background scroll when any modal is open & add escape key listener
  useEffect(() => {
    const isAnyModalOpen = isPopupOpen || isThemesModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsPopupOpen(false);
        setIsThemesModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPopupOpen, isThemesModalOpen]);

  // High-performance, DPI-aware interactive constellation backdrop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animationFrameId;
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const initCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Adjust particle density based on screen resolution
      const count = width < 768 ? 24 : Math.min(48, Math.floor((width * height) / 32000));
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2.2 + 1.2,
          baseAlpha: Math.random() * 0.4 + 0.35,
        });
      }
    };

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initCanvas, 150);
    };
    window.addEventListener("resize", handleResize);
    initCanvas();

    const render = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      // Draw & update particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 198, 250, ${p.baseAlpha})`;
        ctx.fill();

        // Glow ring
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(138, 178, 248, ${p.baseAlpha * 0.18})`;
        ctx.fill();

        // Connect particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 160) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / 160) * 0.18;
            ctx.strokeStyle = `rgba(148, 185, 245, ${lineAlpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        // Mouse interactive connection
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            const mAlpha = (1 - mdist / mouse.radius) * 0.35;
            ctx.strokeStyle = `rgba(195, 218, 255, ${mAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div className="fund-page-wrapper">
        {/* Dynamic canvas backdrop */}
        <canvas ref={canvasRef} className="fund-canvas-bg" />

        {/* Ambient background glows for visual depth */}
        <div className="fund-ambient-glow glow-top-right" aria-hidden="true" />
        <div className="fund-ambient-glow glow-bottom-left" aria-hidden="true" />

        {/* Main Content Container */}
        <div className="fund-content-container">
          {/* Top Hero Row */}
          <div className="fund-hero-section">
            <div className="fund-info-left">
              {/* Category Pill Badge */}
              <div className="fund-category-pill">
                <span className="pill-text">
                  <strong>Category II</strong> Alternative Investment Fund (AIF)
                </span>
              </div>

              {/* Fund Display Title */}
              <h1 className="fund-main-title">
                RRR STRATEGIC <br />
                GROWTH FUND
              </h1>

              {/* Tagline / Fund Thesis */}
              <blockquote className="fund-tagline">
                <span className="tagline-bar" aria-hidden="true" />
                <p>
                  &ldquo;The Fund offers investors the kind of access that has traditionally been reserved for institutions.&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Right Action Area */}
            <div className="fund-cta-right">
              <button
                className="fund-cta-btn primary"
                onClick={() => setIsPopupOpen(true)}
                aria-label="Schedule a Discovery Call"
              >
                <span>Schedule a Discovery Call</span>
                <svg
                  className="cta-arrow"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Highlights Bento Row */}
          <div className="fund-highlights-grid">
            {/* Card 1: Investment Mandate */}
            <div className="fund-highlight-card">
              <div className="card-top-accent">
                <span className="card-badge">MANDATE</span>
                <svg className="card-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="card-title">PRE-IPO GROWTH CAPITAL</h3>
              <p className="card-subtext">Late-stage growth equity & institutional backing</p>
            </div>

            {/* Card 2: Fund Corpus & Green Shoe */}
            <div className="fund-highlight-card featured">
              <div className="card-top-accent">
                <span className="card-badge">TARGET CORPUS</span>
                <svg
                  className="card-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="6" y1="4" x2="18" y2="4"></line>
                  <line x1="6" y1="9" x2="18" y2="9"></line>
                  <path d="M6 4h5.5a3.5 3.5 0 0 1 0 7H6"></path>
                  <path d="M8.5 11.5L16 20"></path>
                </svg>
              </div>
              <h3 className="card-title">&#8377;50 Cr + &#8377;50 Cr Green Shoe</h3>
              <p className="card-subtext">Base fund size with flexible expansion allocation</p>
            </div>

            {/* Card 3: Thematic Focus */}
            <div
              className="fund-highlight-card interactive"
              onClick={() => setIsThemesModalOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setIsThemesModalOpen(true)}
              aria-label="View Five Strategic Growth Themes"
            >
              <div className="card-top-accent">
                <span className="card-badge">PORTFOLIO STRATEGY</span>
                <span className="card-action-indicator">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </span>
              </div>
              <h3 className="card-title">Five Strategic Growth Themes</h3>
              <p className="card-subtext">DeepTech, Fintech, Consumer, Health & CleanTech</p>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Call Popup Modal */}
      <div
        className={`popup-overlay ${isPopupOpen ? "active" : ""}`}
        id="discoveryCallPopup"
        onClick={(e) => {
          if (e.target.id === "discoveryCallPopup") setIsPopupOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="discoveryModalTitle"
      >
        <div className="popup-content">
          <div className="popup-header-row">
            <div>
              <span className="popup-eyebrow">AIF CATEGORY II INQUIRY</span>
              <h2 id="discoveryModalTitle" className="popup-main-heading">
                Schedule a Discovery Call
              </h2>
            </div>
            <button
              className="close-popup"
              aria-label="Close popup"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="form-container">
            <DiscoveryCallForm />
          </div>
        </div>
      </div>

      {/* Five Strategic Growth Themes Modal */}
      <div
        className={`popup-overlay ${isThemesModalOpen ? "active" : ""}`}
        id="themesModalPopup"
        onClick={(e) => {
          if (e.target.id === "themesModalPopup") setIsThemesModalOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="themesModalTitle"
      >
        <div className="popup-content themes-popup-content">
          <div className="popup-header-row">
            <div>
              <span className="popup-eyebrow">INVESTMENT THESIS</span>
              <h2 id="themesModalTitle" className="popup-main-heading">
                Five Strategic Growth Themes
              </h2>
              <p className="popup-desc">
                RRR Strategic Growth Fund focuses on high-conviction, scalable sectors with robust unit economics, strong governance, and clear pre-IPO pathways.
              </p>
            </div>
            <button
              className="close-popup"
              aria-label="Close popup"
              onClick={() => setIsThemesModalOpen(false)}
            >
              &times;
            </button>
          </div>

          <div className="themes-grid-list">
            {STRATEGIC_THEMES.map((theme) => (
              <div key={theme.id} className="theme-modal-card">
                <div className="theme-card-header">
                  <span className="theme-number">{theme.id}</span>
                  <span className="theme-pill-badge">{theme.badge}</span>
                </div>
                <h4 className="theme-card-title">{theme.title}</h4>
                <p className="theme-card-desc">{theme.desc}</p>
              </div>
            ))}
          </div>

          <div className="themes-popup-footer">
            <button
              className="fund-cta-btn primary"
              onClick={() => {
                setIsThemesModalOpen(false);
                setIsPopupOpen(true);
              }}
            >
              <span>Schedule Investor Discovery Call</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
