import { useState, useEffect, useRef } from "react";
import { fetchTeamMembers, API_BASE_URL } from "@/lib/api";
import "@/styles/teams.css";

export default function TeamsPage() {
  const containerRef = useRef(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch team members from API
  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await fetchTeamMembers();
        let members = [];
        if (response && Array.isArray(response.data)) {
          members = response.data;
        } else if (Array.isArray(response)) {
          members = response;
        }

        // Filter active members only
        setTeamMembers(members.filter((m) => m.isActive !== false));
      } catch (error) {
        console.error("Failed to load team members:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTeam();
  }, []);

  // Set up carousel continuous scrolling loop once data is loaded and rendered
  useEffect(() => {
    if (loading || teamMembers.length === 0) return;

    const container = containerRef.current;
    if (!container) return;

    // Get original children (before cloning)
    const originalChildren = Array.from(container.children);
    const originalCount = originalChildren.length;

    // Clone all team members for seamless looping
    originalChildren.forEach((member) => {
      const clone = member.cloneNode(true);
      clone.classList.add("team-member--clone");
      container.appendChild(clone);
    });

    const getOriginalWidth = () => {
      let width = 0;
      for (let i = 0; i < originalCount; i++) {
        width +=
          originalChildren[i].offsetWidth +
          parseInt(window.getComputedStyle(container).gap || 0);
      }
      return width;
    };

    const scrollSpeed = 1.5; // px per frame
    let animationId = null;
    let paused = false;

    function continuousScroll() {
      if (paused) return;
      container.scrollLeft += scrollSpeed;
      // When passed original set, reset scrollLeft to equivalent position
      if (container.scrollLeft >= getOriginalWidth()) {
        container.scrollLeft -= getOriginalWidth();
      }
      animationId = requestAnimationFrame(continuousScroll);
    }

    function startScroll() {
      if (!animationId) {
        paused = false;
        animationId = requestAnimationFrame(continuousScroll);
      }
    }

    function stopScroll() {
      paused = true;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    }

    container.addEventListener("mouseenter", stopScroll);
    container.addEventListener("mouseleave", startScroll);
    container.addEventListener("touchstart", stopScroll);
    container.addEventListener("touchend", startScroll);

    startScroll();

    // Cleanup function
    return () => {
      stopScroll();
      container.removeEventListener("mouseenter", stopScroll);
      container.removeEventListener("mouseleave", startScroll);
      container.removeEventListener("touchstart", stopScroll);
      container.removeEventListener("touchend", startScroll);

      // Remove clones to prevent duplicates on strict mode re-renders or updates
      const clones = container.querySelectorAll(".team-member--clone");
      clones.forEach((clone) => clone.remove());
    };
  }, [loading, teamMembers]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/Images/placeholder-team.png";
    if (imagePath.startsWith("http")) return imagePath;
    console.log("API URL:", import.meta.env.VITE_API_URL);
    const baseUrl = API_BASE_URL
      ? API_BASE_URL.replace("/api", "")
      : "";
    return `${baseUrl}${imagePath}`;
  };

  return (
    <div className="page-container">
      <section className="team-section">
        <div className="our-team">
          <span className="our-team-title">Our Team</span>
          <p className="our-team-desc">
            We are a collective of{" "}
            <span className="highlight-blue">sharp minds and steady hands</span>{" "}
            — investors, researchers, and strategists united by one goal:{" "}
            <span className="highlight-blue">to turn insight into action</span>.
            With deep domain expertise and a relentless curiosity for what’s
            next, we navigate complexity with clarity. At RRR, our strength lies
            not just in numbers, but in the conviction to lead where others
            follow —{" "}
            <span className="highlight-blue">
              designing strategies that endure, and delivering outcomes that
              matter
            </span>
            .
          </p>
        </div>

        {loading ? (
          // Skeleton loaders
          <div className="team-members-container loading">
            {[1, 2, 3, 4].map((num) => (
              <div className="team-member skeleton" key={num}>
                <div className="team-member-card"></div>
                <div className="team-member-info">
                  <div className="skeleton-text name"></div>
                  <div className="skeleton-text role"></div>
                </div>
              </div>
            ))}
          </div>
        ) : teamMembers.length > 0 ? (
          // Carousel track
          <div className="team-members-container" ref={containerRef}>
            {teamMembers.map((member) => {
              const linkedin = member.socialMedia?.find(
                (s) => s.platform && s.platform.toLowerCase() === "linkedin"
              )?.url;

              return (
                <div className="team-member" key={member._id}>
                  <div className="team-member-card">
                    <div className="team-card-animation"></div>
                    <img
                      src={getImageUrl(member.image)}
                      alt={member.name}
                      className="team-member-img"
                    />
                  </div>
                  <div className="team-member-info">
                    <div className="team-member-header">
                      <span className="team-member-name">{member.name.toUpperCase()}</span>
                      {linkedin && (
                        <a
                          href={linkedin}
                          className="linkedin-icon"
                          target="_blank"
                          aria-label="LinkedIn"
                          rel="noopener noreferrer"
                        >
                          <svg height="20px" width="20px" viewBox="0 0 382 382">
                            <path
                              fill="#0077b7"
                              d="M347.445,0H34.555C15.471,0,0,15.471,0,34.555v312.889C0,366.529,15.471,382,34.555,382h312.889 C366.529,382,382,366.529,382,347.444V34.555C382,15.471,366.529,0,347.445,0z M118.207,329.844c0,5.554-4.502,10.056-10.056,10.056 H65.345c-5.554,0-10.056-4.502-10.056-10.056V150.403c0-5.554,4.502-10.056,10.056-10.056h42.806 c5.554,0,10.056,4.502,10.056,10.056V329.844z M86.748,123.432c-22.459,0-40.666-18.207-40.666-40.666S64.289,42.1,86.748,42.1 s40.666,18.207,40.666,40.666S109.208,123.432,86.748,123.432z M341.91,330.654c0,5.106-4.14,9.246-9.246,9.246H286.73 c-5.106,0-9.246-4.14-9.246-9.246v-84.168c0-12.556,3.683-55.021-32.813-55.021c-28.309,0-34.051,29.066-35.204,42.11v97.079 c0,5.106-4.139,9.246-9.246,9.246h-44.426c-5.106,0-9.246-4.14-9.246-9.246V149.593c0-5.106,4.14-9.246,9.246-9.246h44.426 c5.106,0,9.246,4.14,9.246,9.246v15.655c10.497-15.753,26.097-27.912,59.312-27.912c73.552,0,73.131,68.716,73.131,106.472 L341.91,330.654L341.91,330.654z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                    <span className="team-member-role">
                      {member.designation}
                      {member.sectorsCovered && member.sectorsCovered.length > 0 && (
                        <>
                          <br />
                          Sectors Covered: {member.sectorsCovered.join(", ")}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-team-members" style={{ marginTop: "40px", fontSize: "16px" }}>
            No team members found.
          </p>
        )}
      </section>
    </div>
  );
}
