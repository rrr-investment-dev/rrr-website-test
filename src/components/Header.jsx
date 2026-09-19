import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const isDarkPage = pathname?.includes("rrr-strategic-growth-fund");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu on route change / resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
      setDropdownOpen(false);
    }
  }, [menuOpen]);

  return (
    <>
      <div className={`vector-image${isDarkPage ? " dark-theme" : ""}`}>
        <img
          src="/assets/Images/Vector Illustration header.svg"
          alt=""
          width={335}
          height={300}
        />
      </div>
      <div className={`header-container${isDarkPage ? " dark-theme" : ""}`}>
        <header className="header">
          <div
            className={`hamburger-menu${menuOpen ? " active" : ""}`}
            id="hamburger-menu"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            role="button"
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>

          <div className="logo">
            <Link to="/">
              <img
                src="/assets/Images/rrr_text_logo.svg"
                alt="RRR Investments Logo"
                width={100}
                height={73}
              />
            </Link>
          </div>

          <nav className={`nav${menuOpen ? " active" : ""}`} id="nav-menu">
            <Link
              to="/"
              className={`nav-link ${pathname === "/" ? "active" : ""}`}
              id="about-link"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>

            <div
              className={`nav-item dropdown${dropdownOpen ? " active" : ""}`}
              onMouseEnter={() => {
                if (window.innerWidth >= 768) setDropdownOpen(true);
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 768) setDropdownOpen(false);
              }}
            >
              <span
                className={`nav-link dropdown-toggle ${pathname.includes("/offerings") ? "active" : ""}`}
                id="offerings-link"
                onClick={(e) => {
                  if (window.innerWidth < 768) {
                    e.preventDefault();
                    setDropdownOpen((prev) => !prev);
                  }
                }}
                role="button"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Offerings
                <span className="dropdown-arrow"></span>
              </span>
              <div className={`dropdown-menu${dropdownOpen ? " show" : ""}`}>
                <Link
                  to="/offerings/rrr-strategic-growth-fund"
                  className={`dropdown-item ${pathname === "/offerings/rrr-strategic-growth-fund" ? "active" : ""}`}
                  onClick={() => {
                    setDropdownOpen(false);
                    setMenuOpen(false);
                  }}
                >
                  RRR Strategic Growth Fund
                </Link>
              </div>
            </div>

            <Link
              to="/approach"
              className={`nav-link ${pathname === "/approach" ? "active" : ""}`}
              id="approach-link"
              onClick={() => setMenuOpen(false)}
            >
              Approach
            </Link>
            <Link
              to="/teams"
              className={`nav-link ${pathname === "/teams" ? "active" : ""}`}
              id="team-link"
              onClick={() => setMenuOpen(false)}
            >
              Team
            </Link>
            <Link
              to="/careers"
              className={`nav-link ${pathname.startsWith("/careers") ? "active" : ""}`}
              id="careers-link"
              onClick={() => setMenuOpen(false)}
            >
              Careers
            </Link>
          </nav>
        </header>
      </div>
    </>
  );
}
