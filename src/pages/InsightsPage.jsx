import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchPosts, API_BASE_URL } from "@/lib/api";
import "@/styles/insights.css";

export default function InsightsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Fetch all posts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();

        // Extract array whether response is an array directly or inside a property
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

        setPosts(postsArray);
      } catch (error) {
        console.error("Failed to load insights posts", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Filter and search posts (derived during render)
  let filteredPosts = posts;

  // Filter by platform
  if (selectedPlatform !== "all") {
    filteredPosts = filteredPosts.filter(
      (post) => post.platform && post.platform.toLowerCase() === selectedPlatform.toLowerCase()
    );
  }

  // Filter by search query
  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(
      (post) =>
        (post.title && post.title.toLowerCase().includes(query)) ||
        (post.subTitle && post.subTitle.toLowerCase().includes(query)) ||
        (post.description && post.description.toLowerCase().includes(query))
    );
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/Images/market-outlook-section-image.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = API_BASE_URL
      ? API_BASE_URL.replace("/api", "")
      : "";
    return `${baseUrl}${imagePath}`;
  };

  return (
    <div className="page-container insights-page">
      {/* Header */}
      <header className="insights-header">
        <Link to="/" className="insights-back-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </Link>
        <h1 className="insights-title">All Insights</h1>
        <p className="insights-subtitle">
          Explore our complete archive of research, market outlook summaries,
          and strategic posts curated for long-term investors.
        </p>
      </header>

      {/* Controls: Search and Filters */}
      <section className="insights-controls">
        {/* Search */}
        <div className="search-box-wrapper">
          <span className="search-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {["all", "linkedin", "twitter", "instagram"].map((platform) => (
            <button
              key={platform}
              className={`filter-tab ${selectedPlatform === platform ? "active" : ""}`}
              onClick={() => setSelectedPlatform(platform)}
            >
              {platform === "all" ? "All Platforms" : platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Content */}
      <section className="insights-content">
        {loading ? (
          // Skeleton loading state
          <div className="insights-grid">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-text title"></div>
                  <div className="skeleton-text subtitle"></div>
                  <div className="skeleton-text body-1"></div>
                  <div className="skeleton-text body-2"></div>
                  <div className="skeleton-text body-3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          // Post Grid
          <div className="insights-grid">
            {filteredPosts.map((post) => (
              <div className="insight-card" key={post._id}>
                <div className="insight-image-wrapper">
                  <img
                    src={getImageUrl(post.image)}
                    alt={post.title || "Insight Image"}
                    className="insight-image"
                  />
                  {post.platform && (
                    <span className={`platform-badge ${post.platform.toLowerCase()}`}>
                      {post.platform}
                    </span>
                  )}
                </div>
                <div className="insight-card-content">
                  <h3 className="insight-card-title">{post.title}</h3>
                  {post.subTitle && <h4 className="insight-card-subtitle">{post.subTitle}</h4>}
                  <p className="insight-card-desc">{post.description}</p>
                  <div className="insight-card-footer">
                    <span className="insight-explore-link">Explore the complete story</span>
                    <a
                      href={post.link || "#"}
                      className="insight-arrow-btn"
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
        ) : (
          // Empty State
          <div className="insights-empty-state">
            <h3>No Insights Found</h3>
            <p>We couldn&apos;t find any posts matching your search query or filter settings.</p>
          </div>
        )}
      </section>
    </div>
  );
}
