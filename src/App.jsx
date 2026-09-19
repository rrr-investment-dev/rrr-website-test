import { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HomePage from "@/pages/HomePage";
import ApproachPage from "@/pages/ApproachPage";
import InsightsPage from "@/pages/InsightsPage";
import StrategicGrowthFundPage from "@/pages/StrategicGrowthFundPage";
import TeamsPage from "@/pages/TeamsPage";
import CareersPage from "@/pages/CareersPage";
import JobDetailsPage from "@/pages/JobDetailsPage";

import "./globals.css";
import "@/styles/media-queries.css";
import "@/styles/components/header.css";
import "@/styles/components/footer.css";
import "@/styles/components/form.css";

export default function App() {
  const lenisRef = useRef(null);
  const location = useLocation();

  // Initialize site-wide smooth scrolling with Lenis
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    window.__lenis = lenis;

    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  // Scroll to top immediately on route changes
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/approach" element={<ApproachPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/offerings/rrr-strategic-growth-fund" element={<StrategicGrowthFundPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:id" element={<JobDetailsPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
