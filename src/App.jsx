import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import Callback from "./pages/Callback";
import SplashIntro from "./components/intro/SplashIntro";
import Navbar from "./components/Navbar";

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
      </Routes>
    </>
  );
}
