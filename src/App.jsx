import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
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

export default function App() {
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
      </Routes>
    </>
  );
}
