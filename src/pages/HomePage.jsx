import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchPosts, API_BASE_URL } from "@/lib/api";
import DiscoveryCallForm from "@/components/DiscoveryCallForm";
import "@/styles/home.css";

export default function HomePage() {
  const heroSectionRef = useRef(null);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [activeTab, setActiveTab] = useState("Insights");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isReadMoreExpanded, setIsReadMoreExpanded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Fetch Posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();

        // Extract array whether response is an array directly or inside a data/posts property
        let postsArray = [];
        if (Array.isArray(data)) {
          postsArray = data;
        } else if (data && Array.isArray(data.data)) {
          postsArray = data.data;
        } else if (data && Array.isArray(data.posts)) {
          postsArray = data.posts;
        } else if (data && data.data && Array.isArray(data.data.posts)) {
          postsArray = data.data.posts;
        }

        // Set all posts returned by the API
        setPosts(postsArray);
      } catch (error) {
        console.error("Failed to load posts", error);
      } finally {
        setLoadingPosts(false);
      }
    };
    loadPosts();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/Images/market-outlook-section-image.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    console.log("API URL:", import.meta.env.VITE_API_URL);
    const baseUrl = API_BASE_URL
      ? API_BASE_URL.replace("/api", "")
      : "";
    return `${baseUrl}${imagePath}`;
  };

  // Parallax Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      if (!heroSectionRef.current) return;
      const rect = heroSectionRef.current.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        setParallaxOffset(rect.top * 0.3);
      } else {
        setParallaxOffset(0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Popup body scroll lock
  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isPopupOpen]);

  // Close popup on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isPopupOpen) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPopupOpen]);

  return (
    <>
      <div className="hero-vector">
        <img
          src="/assets/Images/Vector Illustration main.svg"
          alt="Decorative Background"
          className="hero-vector-image"
        />
      </div>

      <div className="page-container">
        <section className="hero-section" ref={heroSectionRef}>
          <div className="hero-content">
            <h2 className="hero-heading">Invest with Purpose.</h2>
            <p className="hero-subheading">Grow with Strategy.</p>
            <div className="hero-cta" onClick={() => setIsPopupOpen(true)}>
              <span>Schedule a Discovery Call</span>
            </div>
          </div>
          <div className="hero-image">
            <img
              src="/assets/Images/RRR 3d logo lg.png"
              alt="RRR Hero Visual"
              style={{ transform: `translateY(${parallaxOffset}px)` }}
            />
          </div>
          <div className="philosophy-section">
            <h3 className="philosophy-heading">
              A Philosophy Rooted in Discipline
            </h3>
            <div
              className={`company-description ${isReadMoreExpanded ? "active" : ""}`}
            >
              <p className="desc-paragraph first-paragraph">
                RRR is a dynamic investment institution founded with the purpose
                of creating an institution deeply rooted in investment
                principles. Guided by the vision of HH Sri Sri Ravishankar ji,
                RRR embodies values of ethics, innovation, courage, and
                intuition. These core beliefs serve as the foundation of its
                philosophy, enabling the firm to pursue opportunities that often
                remain unseen by larger, more rigid institutions. With agility
                as a defining trait, RRR thrives on identifying creative ideas
                and niche opportunities that align with its disciplined
                approach.
              </p>
              <p className="desc-paragraph second-paragraph">
                The firm’s strategy is bold and forward-thinking, built upon a
                unique blend of scuttlebutt research, perception-based
                investing, and venture-style strategies applied within public
                markets. RRR’s focus spans across equities, start-ups, SMEs, and
                unlisted ventures, ensuring a broad spectrum of investment
                opportunities. By carefully balancing value creation and risk,
                the firm positions itself to achieve long-term growth while
                remaining adaptable in the face of change. With a time horizon
                of 7 to 10 years, RRR emphasizes patience and persistence, yet
                maintains the flexibility to respond swiftly to evolving market
                dynamics. This philosophy of disciplined innovation enables RRR
                to stand apart as a progressive and visionary institution.
              </p>
              <button
                className="read-more-btn"
                onClick={() => setIsReadMoreExpanded(!isReadMoreExpanded)}
              >
                {isReadMoreExpanded ? "Read less..." : "Read more..."}
              </button>
            </div>
          </div>
        </section>

        <section className="key-differentiators-section">
          <h3 className="differentiators-heading">Key Differentiators</h3>
          <div className="infographic-container">
            <div className="infographic-row">
              <div className="infographic-card first-card">
                <div className="infographic-card-content">
                  <span>We don’t chase hype.</span>
                  <p>We uncover value others overlook.</p>
                </div>
              </div>
              <div className="infographic-card second-card">
                <div className="infographic-card-content">
                  <span>Lean. Focused. Fast.</span>
                  <p>
                    RRR explores what others can’t — under-researched equities,
                    emerging sectors, and special situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="infographic-row">
              <div className="infographic-card third-card">
                <div className="infographic-card-content">
                  <span>Our Edge?</span>
                  <p>
                    Bridging institutional insight with boutique attention.
                    Where others see noise, we find signal.
                  </p>
                </div>
              </div>
              <div className="infographic-card forth-card">
                <div className="infographic-card-content">
                  <p>
                    With RRR, you’re not only<br className="mobile-only-br" /> invested —{" "}
                    <span>
                      you’re<br className="mobile-only-br" /> equipped.
                    </span>
                  </p>
                  <img
                    src="/assets/Images/full-vector-illustration.svg"
                    alt="Decorative Background"
                    className="vector-image-infographic-top"
                  />
                </div>
              </div>
            </div>

            <div className="infographic-row">
              <div className="infographic-card fifth-card">
                <div className="infographic-card-content">
                  <span>Partnership, not service.</span>
                  <p>
                    With deep research, market awareness, and skin in the game,
                    we act as your investment partner.
                  </p>
                </div>
                <img
                  src="/assets/Images/full-vector-illustration.svg"
                  alt="Decorative Background"
                  className="vector-image-infographic-bottom"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="strategies-section">
          <div className="strategies-grid">
            <div className="strategy-item">
              <h4>Venture-Style Approach</h4>
              <img src="/assets/Images/venture_style_icon.svg" alt="" />
            </div>
            <div className="strategy-item">
              <h4>Perception Investing</h4>
              <img src="/assets/Images/perception_investing_icon.svg" alt="" />
            </div>
            <div className="strategy-item">
              <h4>Long Term Tailwinds</h4>
              <img src="/assets/Images/long_term_icon.svg" alt="" />
            </div>
            <div className="strategy-item">
              <h4>Scuttlebutt Approach</h4>
              <img src="/assets/Images/scuttlebutt_icon.svg" alt="" />
            </div>
          </div>
        </section>
      </div>

      <div className="full-width-wrapper">
        <section className="join-club-rrr">
          <img
            src="/assets/Images/full-width-bg-img.svg"
            alt="Background"
            className="background-image"
          />
          <div className="cta-content">
            <h2>
              Get your investment in shape with
              <br />
              our active investing strategies.
            </h2>
          </div>
        </section>
      </div>

      <div className="page-container">
        <section className="market-outlook-section">
          <div
            className={`section-labels ${activeTab === "Research" ? "research-active" : ""}`}
          >
            <div className="slider"></div>
            <span
              className={`label ${activeTab === "Insights" ? "active" : ""}`}
              onClick={() => setActiveTab("Insights")}
            >
              Insights
            </span>
            <span
              className={`label ${activeTab === "Research" ? "active" : ""}`}
              onClick={() => setActiveTab("Research")}
            >
              Research
            </span>
          </div>
          <h2 className="outlook-title">
            Global Market Sentiment and Investor Mindset
          </h2>
          <div className="content-grid">
            {loadingPosts ? (
              <p>Loading posts...</p>
            ) : posts.length > 0 ? (
              <>
                <div className="main-card">
                  <img
                    src={getImageUrl(posts[0].image)}
                    alt={posts[0].title || "Market Image"}
                    className="main-image"
                  />
                  <div className="card-content">
                    <h3 className="main-heading">
                      {posts[0].title}{" "}
                      {posts[0].platform && `(${posts[0].platform})`}
                    </h3>
                    <h4 className="subheading">{posts[0].subTitle}</h4>
                    <p className="description">{posts[0].description}</p>
                    <div className="card-footer">
                      <span className="arrows-links">
                        Explore the complete story
                      </span>
                      <a
                        href={posts[0].link || "#"}
                        className="arrows-links-wrapper arrow-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        →
                      </a>
                    </div>
                  </div>
                </div>

                {posts.length > 1 && (
                  <div className="dashboard-cards">
                    {posts.slice(1, 3).map((post) => (
                      <div className="dashboard-card" key={post._id}>
                        <div className="blue-bar"></div>
                        <div className="dashboard-content">
                          <h4>
                            {post.title} {post.platform && `(${post.platform})`}
                          </h4>
                          <p className="subtitle">{post.subTitle}</p>
                          <p className="desc">{post.description}</p>
                          <div className="card-footer">
                            <span className="arrows-links">
                              Explore the complete story
                            </span>
                            <a
                              href={post.link || "#"}
                              className="arrows-links-wrapper arrow-btn"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              →
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p>No insights available right now.</p>
            )}
          </div>
          <div className="all-insights">
            <Link to="/insights">
              <button>All Insights</button>
            </Link>
          </div>
        </section>
      </div>

      <div className="full-width-wrapper">
        <section id="about" className="about-section">
          <h2 className="about-section-title">About Us</h2>
          <p className="section-subtitle">We help invest without boundaries</p>
          <div className="about-columns">
            <div className="about-column">
              <h2>Leadership</h2>
              <div className="horizontal-line"></div>
              <p className="about-description">
                Our leaders are the passionate expertise you can trust, making
                financial security more achievable and exceeding client
                expectations
              </p>
              <div className="card-footer">
                <span className="arrows-links arrows-links-white about-subheading">
                  Our team
                </span>
                <Link to="/teams" style={{ textDecoration: "none" }}>
                  <button className="arrow-btn arrow-btn-white about-arrow">
                    →
                  </button>
                </Link>
              </div>
            </div>
            <div className="about-column">
              <h2>Approach</h2>
              <div className="horizontal-line"></div>
              <p className="about-description">
                We source and select the best managers across public and private
                markets.
              </p>
              <div className="card-footer">
                <span className="arrows-links arrows-links-white about-subheading">
                  How we work
                </span>
                <Link to="/approach" style={{ textDecoration: "none" }}>
                  <button className="arrow-btn arrow-btn-white about-arrow">
                    →
                  </button>
                </Link>
              </div>
            </div>
            <div className="about-column">
              <h2>Responsibility</h2>
              <div className="horizontal-line"></div>
              <p className="about-description">
                We embody a strong commitment to exceptional standards of
                corporate responsibility.
              </p>
              <div className="card-footer">
                <span className="arrows-links arrows-links-white about-subheading">
                  Our standards
                </span>
                <button className="arrow-btn arrow-btn-white about-arrow">
                  →
                </button>
              </div>
            </div>
            <img
              src="/assets/Images/about-top-vector-illustration.svg"
              alt="Decorative Background"
              className="about-top-vector"
            />
            <img
              src="/assets/Images/about-bottom-vector-illustration.svg"
              alt="Decorative Background"
              className="about-bottom-vector"
            />
          </div>
        </section>
      </div>

      <div className="page-container">
        <section className="homepage-insights-section">
          <p className="insights-heading">
            Your next investment decision begins here.
          </p>
          <p className="insights-subheading">
            Let&apos;s explore how RRR crafts exclusive portfolios for growth.
          </p>
          <button
            className="insights-cta-button"
            onClick={() => setIsPopupOpen(true)}
          >
            Schedule a Discovery Call
          </button>
        </section>

        <section className="club-section">
          <h2 className="club-title">Inside Club RRR</h2>
          <p className="club-description">
            Club RRR gives select investors exclusive access to insights,
            tailored strategies, private networking, and curated opportunities
            not available elsewhere. Joining the club means benefiting from
            priority deal flow, ongoing education, and a close community focused
            on building legacy wealth together.
          </p>
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
          <button
            className="close-popup"
            aria-label="Close popup"
            onClick={() => setIsPopupOpen(false)}
          >
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
