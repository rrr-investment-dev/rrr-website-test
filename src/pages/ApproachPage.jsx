import { useState, useEffect, useRef } from "react";
import DiscoveryCallForm from "@/components/DiscoveryCallForm";
import "@/styles/approach.css";

export default function ApproachPage() {
  // 1. Pillars Accordion State
  const [activePillar, setActivePillar] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Refs for Scroll Animations
  const coreSectionRef = useRef(null);
  const coreTrackRef = useRef(null);
  const coreItemsRef = useRef([]);

  const frameworkSectionRef = useRef(null);
  const frameworkStickyRef = useRef(null);
  const funnelsRef = useRef([]);

  const portfolioRef = useRef(null);

  // 2. C.O.R.E Section Scroll Logic
  useEffect(() => {
    const updateCoreScroll = () => {
      if (!coreSectionRef.current || !coreTrackRef.current) return;

      const coreSection = coreSectionRef.current;
      const coreTrack = coreTrackRef.current;

      const sectionTop = coreSection.offsetTop;
      const sectionHeight = coreSection.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const startScroll = sectionTop;
      const endScroll = sectionTop + sectionHeight - windowHeight;

      const scrollDistance = scrollY - startScroll;
      const maxScroll = endScroll - startScroll;

      let percentage = scrollDistance / maxScroll;
      percentage = Math.max(0, Math.min(percentage, 1));

      const trackWidth = coreTrack.scrollWidth;
      const viewportWidth = window.innerWidth;

      if (trackWidth > viewportWidth) {
        const maxTranslate = trackWidth - viewportWidth;
        const translateX = -(percentage * maxTranslate);
        coreTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;
      }

      coreItemsRef.current.forEach((item, index) => {
        if (!item) return;
        const node = item.querySelector(".core-node");
        if (node) {
          const totalItems = coreItemsRef.current.length;
          const threshold = index / totalItems;
          if (percentage >= threshold - 0.05) {
            node.classList.add("active");
          } else {
            node.classList.remove("active");
          }
        }
      });
    };

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateCoreScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateCoreScroll);
    updateCoreScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCoreScroll);
    };
  }, []);

  // 3. Framework Section Exploding Funnel Animation
  useEffect(() => {
    const handleFrameworkScroll = () => {
      if (!frameworkSectionRef.current || !frameworkStickyRef.current) return;

      const section = frameworkSectionRef.current;
      const sticky = frameworkStickyRef.current;
      const scrollY = window.scrollY;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      const stickyStyle = window.getComputedStyle(sticky);
      const stickyTopOffset = parseInt(stickyStyle.top) || 0;
      const stickyHeight = sticky.offsetHeight;

      const start = sectionTop - stickyTopOffset;
      const end = start + sectionHeight - stickyHeight;

      const maxScroll = end - start;
      let progress = 0;

      if (scrollY <= start) {
        progress = 0;
      } else if (scrollY >= end) {
        progress = 1;
      } else if (maxScroll > 0) {
        progress = (scrollY - start) / maxScroll;
      }

      const textSlideDistance = 60; // px the text travels in from its own side while fading in

      funnelsRef.current.forEach((wrapper) => {
        if (!wrapper) return;
        const funnelImg = wrapper.querySelector(".funnel-img");
        const textContent = wrapper.querySelector(".text-content");
        if (!funnelImg || !textContent) return;

        // .funnel-wrapper is a real 2-column grid (see approach.css) - its
        // resting layout (image centered in one column, text filling the
        // other, mirrored for the middle funnel) IS the final design.
        // offsetLeft / offsetWidth reflect that resting position regardless
        // of any transform already applied, so on every frame we can measure
        // how far each element's resting center sits from the row's center.
        const wrapperCenter = wrapper.offsetWidth / 2;

        // The funnel image still animates in from the wrapper's center
        // (progress 0: funnels-stacked-in-the-middle look; progress 1:
        // resting in its grid column).
        const imgCenter = funnelImg.offsetLeft + funnelImg.offsetWidth / 2;
        const imgCenterOffset = wrapperCenter - imgCenter;
        funnelImg.style.transform = `translateX(${imgCenterOffset * (1 - progress)}px)`;

        // The text instead enters from its own side, not the center: whichever
        // half of the row it rests in (left or right of wrapperCenter), it
        // starts further out on that same side and slides in to its resting
        // spot, so the middle funnel's text arrives from the left while the
        // top and bottom funnels' text arrives from the right.
        const textCenter = textContent.offsetLeft + textContent.offsetWidth / 2;
        const slideSign = textCenter < wrapperCenter ? -1 : 1;
        textContent.style.transform = `translateX(${slideSign * textSlideDistance * (1 - progress)}px)`;
        textContent.style.opacity = progress;
      });
    };

    let ticking = false;
    const scrollListener = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleFrameworkScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollListener);
    handleFrameworkScroll();

    return () => window.removeEventListener("scroll", scrollListener);
  }, []);

  // 4. Portfolio Section Intersection Observer
  useEffect(() => {
    if (!portfolioRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(portfolioRef.current);
    return () => observer.disconnect();
  }, []);

  // Popup logic
  useEffect(() => {
    if (isPopupOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [isPopupOpen]);

  return (
    <>
      <div className="page-container">
        <section className="approach-hero">
          <div className="approach-text">
            <p>
              At <strong>RRR Investments</strong>, we believe superior returns
              are born from a <strong>balance</strong> of
              <strong> discipline, foresight</strong>, and
              <strong> on-ground intelligence.</strong> Our approach combines
              market signals, regulatory insights, and first-hand research to
              build
              <strong> conviction-driven portfolios that stand the test of time.</strong>
            </p>
          </div>

          <div className="approach-visual">
            <div className="visual-wrapper">
              <div className="visual-label">From Insights to Impact</div>
              <div className="chart-container">
                <img
                  src="/assets/Images/approach-chart.png"
                  alt="Growth Chart: From Insights to Impact"
                  className="chart-image"
                />
              </div>
            </div>
          </div>

          <div className="scroll-down-wrapper">
            <span className="scroll-text">scroll down</span>
            <svg
              width="30px"
              height="30px"
              viewBox="0 0 32.00 32.00"
              xmlns="http://www.w3.org/2000/svg"
              fill="#00338D"
            >
              <g strokeWidth="0"></g>
              <g strokeLinecap="round" strokeLinejoin="round"></g>
              <g>
                <g>
                  <line fill="none" stroke="#00338d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.496" x1="16" x2="7" y1="20.5" y2="11.5"></line>
                  <line fill="none" stroke="#00338d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.496" x1="25" x2="16" y1="11.5" y2="20.5"></line>
                </g>
              </g>
            </svg>
          </div>
        </section>

        <section className="pillars-section">
          <h2 className="section-title">Pillars of our approach</h2>
          <div className="pillars-content">
            <div className="pillars-accordion">
              <div
                className={`accordion-item ${activePillar === 1 ? "active" : ""}`}
                onClick={() => setActivePillar(1)}
              >
                <div className="accordion-header">
                  <h3>Informed by Market Signals</h3>
                  <span className="icon-toggle"></span>
                </div>
                <div className="accordion-body">
                  <p>
                    We track and decode key regulatory and market
                    triggers: NSE/BSE announcements, ESM/ASM alerts, government
                    policies, and corporate acquisition news (including NARCL
                    updates). These signals often provide the earliest hints of
                    industry shifts.
                  </p>
                </div>
              </div>

              <div
                className={`accordion-item ${activePillar === 2 ? "active" : ""}`}
                onClick={() => setActivePillar(2)}
              >
                <div className="accordion-header">
                  <h3>Strengthened by Ground Work</h3>
                  <span className="icon-toggle"></span>
                </div>
                <div className="accordion-body">
                  <p>
                    Numbers tell one part of the story, people tell the rest.
                    Our team leverages the scuttlebutt approach, speaking to
                    suppliers, customers, and industry participants, to uncover
                    truths that don’t appear in reports. We regularly meet
                    company managements to test our hypotheses and align
                    perspectives.
                  </p>
                </div>
              </div>

              <div
                className={`accordion-item ${activePillar === 3 ? "active" : ""}`}
                onClick={() => setActivePillar(3)}
              >
                <div className="accordion-header">
                  <h3>Driven by Agility</h3>
                  <span className="icon-toggle"></span>
                </div>
                <div className="accordion-body">
                  <p>
                    Markets reward adaptability. Using our CORE framework, we
                    constantly test assumptions and reposition when required.
                    This agility allows us to identify young, fast-growing
                    businesses that are positioned for structural growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="pillars-visual">
              <div className="visual-card-stack" data-active={activePillar}>
                <div className={`visual-card ${activePillar === 1 ? "active" : ""}`}>
                  <img src="/assets/Images/subtract-1.svg" alt="Market Signals Icon" />
                </div>
                <div className={`visual-card ${activePillar === 2 ? "active" : ""}`}>
                  <img src="/assets/Images/subtract-2.svg" alt="Ground Work Icon" />
                </div>
                <div className={`visual-card ${activePillar === 3 ? "active" : ""}`}>
                  <img src="/assets/Images/subtract-3.svg" alt="Agility Icon" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* C.O.R.E SECTION */}
      <section className="core-section" ref={coreSectionRef}>
        <div className="core-sticky-wrapper">
          <h2 className="section-title core-main-title">C.O.R.E</h2>
          <div className="core-horizontal-track" ref={coreTrackRef}>
            <div className="core-timeline-line"></div>

            <div className="core-item" ref={el => coreItemsRef.current[0] = el}>
              <div className="core-node"></div>
              <div className="core-content">
                <h3>Contrarian Lens</h3>
                <p>
                  RRR Investments challenges consensus thinking to uncover
                  opportunities others miss. We take positions only where facts
                  outweigh sentiment and conviction is built on evidence, not
                  market mood.
                </p>
              </div>
            </div>

            <div className="core-item" ref={el => coreItemsRef.current[1] = el}>
              <div className="core-node"></div>
              <div className="core-content">
                <h3>Original Insights through scuttlebutt</h3>
                <p>
                  We generate differentiated insights by engaging with
                  customers, suppliers, distributors and competitors. This
                  ground-level intelligence helps us validate assumptions,
                  understand real business momentum, and stay ahead of purely
                  desk-based research.
                </p>
              </div>
            </div>

            <div className="core-item" ref={el => coreItemsRef.current[2] = el}>
              <div className="core-node"></div>
              <div className="core-content">
                <h3>Risk calibrated venture investing</h3>
                <p>
                  We invest in early-stage growth stories in public and private
                  markets. Our approach balances venture capital through
                  disciplined position sizing and risk reward evaluation.
                </p>
              </div>
            </div>

            <div className="core-item" ref={el => coreItemsRef.current[3] = el}>
              <div className="core-node"></div>
              <div className="core-content">
                <h3>Edge through proxy and perception</h3>
                <p>
                  We look beyond direct beneficiaries to identify proxy
                  exposures value-chain businesses poised to benefit indirectly.
                  We also track sentiment and investor psychology to anticipate
                  sentiment shifts ahead of price, creating a differentiated and
                  durable edge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="framework-section" ref={frameworkSectionRef}>
        <div className="framework-sticky" ref={frameworkStickyRef}>
          <h2 className="framework-main-title">Our Research Framework</h2>
          <span className="framework-subtitle">How we turn information into conviction</span>
          <div className="funnel-container">
            <div className="funnel-wrapper funnel-1" ref={el => funnelsRef.current[0] = el}>
              <img src="/assets/Images/funnel-1.svg" alt="Market Signal Funnel" className="funnel-img" />
              <div className="text-content text-right text-block-1">
                <h3>Market Signal</h3>
                <ul>
                  <li>NSE/BSE announcements</li>
                  <li>Regulatory frameworks like ASM/ESM</li>
                  <li>Government policy updates</li>
                  <li>Acquisition & restructuring news</li>
                </ul>
              </div>
            </div>

            <div className="funnel-wrapper funnel-2" ref={el => funnelsRef.current[1] = el}>
              <img src="/assets/Images/funnel-2.svg" alt="Company-Specific Validation Funnel" className="funnel-img" />
              <div className="text-content text-left text-block-2">
                <h3>Company-Specific Validation</h3>
                <ul>
                  <li>Draft Red Herring Prospectus (DRHP)</li>
                  <li>Scuttlebutt checks across supply chains</li>
                  <li>Direct management meetings</li>
                </ul>
              </div>
            </div>

            <div className="funnel-wrapper funnel-3" ref={el => funnelsRef.current[2] = el}>
              <img src="/assets/Images/funnel-3.svg" alt="On-Ground Evidence Funnel" className="funnel-img" />
              <div className="text-content text-right text-block-3">
                <h3>On-Ground Evidence</h3>
                <ul>
                  <li>C.O.R.E framework application</li>
                  <li>Identifying early-stage growth</li>
                  <li>Validating long-term scalability</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container">
        <section className="portfolio-section">
          <h2 className="section-title">Portfolio Approach</h2>
          <div className="portfolio-content fade-slide-up" ref={portfolioRef}>
            <div className="portfolio-text-side">
              <div className="portfolio-item portfolio-item-1">
                <h3>Curated Concentration</h3>
                <p>
                  We deliberately build a concentrated portfolio of 15-25
                  high-conviction stocks. Each holding is chosen with precision,
                  backed by extensive research and validated through multiple
                  layers of evidence.
                </p>
              </div>

              <div className="portfolio-item portfolio-item-2">
                <h3>Focused Outcomes</h3>
                <p>
                  By staying selective, we ensure every company in the portfolio
                  has the potential to materially impact investor
                  outcomes, rather than getting lost in a sea of
                  over-diversification.
                </p>
              </div>
            </div>

            <div className="portfolio-visual">
              <img src="/assets/Images/portfolio-visual.svg" alt="Portfolio Distribution" className="portfolio-chart" />
              <div className="glass-bubble">
                <img src="/assets/Images/bubble.svg" alt="Magnifier Bubble" className="portfolio-bubble" />
              </div>
            </div>
          </div>
        </section>

        <section className="differ-section">
          <h2 className="differ-title">How We <span className="blue-text">Differ</span></h2>
          <img src="/assets/Images/vertical waves.svg" alt="" className="bg-waves" />

          <div className="differ-container">
            <div className="differ-grid">
              <div className="differ-column conventional">
                <h3>Conventional Thinking</h3>
                <div className="differ-items">
                  <div className="differ-bubble">Quarterly or annual focus</div>
                  <div className="differ-bubble">Reactive to news flows</div>
                  <div className="differ-bubble">Desk-only research</div>
                  <div className="differ-bubble">Over-diversification</div>
                  <div className="differ-bubble">Reliance on consensus views</div>
                </div>
              </div>

              <div className="differ-divider"></div>

              <div className="differ-column rrr">
                <h3>RRR Approach</h3>
                <div className="differ-items">
                  <div className="differ-bubble">Rolling 3-5 years horizon</div>
                  <div className="differ-bubble">Regulatory signals + on-ground</div>
                  <div className="differ-bubble">Structural growth trends</div>
                  <div className="differ-bubble">Concentrated conviction</div>
                  <div className="differ-bubble">Adaptive C.O.R.E framework</div>
                </div>
              </div>
            </div>

            {/* Kept existing picture tag for responsive arrows */}
            <picture className="bg-arrows">
              <source media="(min-width: 768px)" srcSet="/assets/Images/large-screen-arrows.svg" />
              <img src="/assets/Images/mobile-screen-arrows.svg" alt="Decorative arrows" className="bg-arrows-img" />
            </picture>
          </div>
        </section>

        <section className="markets-section">
          <div className="markets-heading-block">
            <h2 className="markets-title">We don&apos;t just follow markets.</h2>
            <p className="markets-subtitle">We meet them, question them, and get ahead of them</p>
          </div>
          <blockquote className="markets-quote">
            <p>
              At RRR Investments, investing is not about chasing the next
              headline, it&apos;s about anticipating the shifts that matter. By
              combining data, dialogue, and discipline, we uncover opportunities
              that create lasting value.
            </p>
            <p>
              Our approach ensures that investors are not just part of the
              market cycle, but ahead of it.
            </p>
          </blockquote>
        </section>

        <section className="insights-section">
          <p className="insights-heading">Your next investment decision begins here.</p>
          <p className="insights-subheading">Let&apos;s explore how RRR crafts exclusive portfolios for growth.</p>
          <button className="insights-cta-button" onClick={() => setIsPopupOpen(true)}>
            Schedule a Discovery Call
          </button>
        </section>
      </div>

      {/* Popup Overlay */}
      <div
        className={`popup-overlay ${isPopupOpen ? "active" : ""}`}
        id="discoveryCallPopup"
        onClick={(e) => {
          if (e.target.id === "discoveryCallPopup") setIsPopupOpen(false);
        }}
      >
        <div className="popup-content">
          <button className="close-popup" aria-label="Close popup" onClick={() => setIsPopupOpen(false)}>
            &times;
          </button>
          <div className="form-container">
            <DiscoveryCallForm />
          </div>
        </div>
      </div>
    </>
  );
}
