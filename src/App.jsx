import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import Callback from "./pages/Callback";
import SplashIntro from "./components/intro/SplashIntro";
import Navbar from "./components/Navbar";
import Mentorship from "./pages/Mentorship";
import HowitWorks from "./pages/HowItWorks";
import CollegeExplorer from "./pages/CollegeExplorer";
import EngineeringColleges from "./pages/EngineeringColleges";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Journal from "./pages/Journal";
import Discover from "./pages/Discover";
import ExplorePaths from "./pages/ExplorePaths";
import Scholarships from "./pages/Scholarships";
import ExamCalendar from "./pages/ExamCalendar";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";
import AIGuide from "./components/chat/AIGuide";

export default function App() {
  const location = useLocation();
  // ✅ show splash once per tab/session
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem("saarathi_intro_done");
  });

  const handleIntroFinish = () => {
    sessionStorage.setItem("saarathi_intro_done", "true");
    setShowIntro(false);
  };

  return (
    <>
      <ScrollToTop />
      {/* NAVBAR ALWAYS PRESENT */}
      <Navbar animate={!showIntro} />

      {/* SPLASH INTRO */}
      <AnimatePresence>
        {showIntro && (
          <SplashIntro onFinish={handleIntroFinish} />
        )}
      </AnimatePresence>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/how-it-works" element={<HowitWorks />} />
        <Route path="/college-explorer" element={<CollegeExplorer />} />
        <Route path="/college-explorer/engineering" element={<EngineeringColleges />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/explore" element={<ExplorePaths />} />
        <Route path="/scholarships" element={<Scholarships />} />
        <Route path="/calendar" element={<ExamCalendar />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* GLOBAL AI MENTOR WIDGET */}
      <AIGuide />
    </>
  );
}
