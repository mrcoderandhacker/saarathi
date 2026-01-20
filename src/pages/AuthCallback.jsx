import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase will automatically exchange the code
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error.message);
        navigate("/auth");
        return;
      }

      if (data?.session) {
        console.log("Session restored:", data.session.user.id);
        navigate("/dashboard");
      } else {
        navigate("/auth");
      }
    };

    handleAuth();
  }, [navigate]);

  return null; // or a loading spinner
}
