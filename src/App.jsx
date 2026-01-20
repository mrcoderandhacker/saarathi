import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Auth from "./pages/Auth";
import Callback from "./pages/Callback";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/callback" element={<Callback />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}
