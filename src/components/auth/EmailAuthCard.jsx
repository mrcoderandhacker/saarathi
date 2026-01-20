import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import styled from "styled-components";
import { motion } from "framer-motion";

/* ------------------ STYLES ------------------ */

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2.8rem 2.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.06);
  max-width: 420px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: #111827;
  margin-bottom: 0.6rem;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.8rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  margin-bottom: 1.2rem;
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  background: ${({ disabled }) => (disabled ? "#9ca3af" : "#111827")};
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 999px;
  font-family: "Inter", sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${({ disabled }) => (disabled ? "#9ca3af" : "#1f2937")};
  }
`;

const Message = styled.p`
  font-size: 0.85rem;
  color: ${({ error }) => (error ? "#b91c1c" : "#065f46")};
  margin-top: 1rem;
  text-align: center;
  font-family: "Inter", sans-serif;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* ------------------ COMPONENT ------------------ */

export default function EmailAuthCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Function to save onboarding data to database
  const saveOnboardingDataToDatabase = async (user) => {
    console.log("💾 Attempting to save onboarding data to database...");
    
    try {
      // Get data from localStorage
      const rawData = localStorage.getItem("saarathi_onboarding");
      
      if (!rawData) {
        console.warn("⚠️ No onboarding data found in localStorage");
        return false;
      }
      
      const answers = JSON.parse(rawData);
      console.log("📋 Parsed onboarding data:", answers);
      
      // Normalize phone numbers
      const normalizePhone = (phone) => {
        if (!phone) return null;
        if (typeof phone === 'string') {
          // Remove any non-digit characters
          const digits = phone.replace(/\D/g, '');
          if (digits.length === 10) {
            return `+91${digits}`;
          }
          return phone;
        }
        return null;
      };
      
      const phone = normalizePhone(answers.phone);
      const whatsapp = normalizePhone(answers.whatsapp) || phone;
      
      console.log("📱 Normalized phone:", phone);
      
      // Check if profile already exists
      const { data: existingProfile, error: selectError } = await supabase
        .from("student_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (selectError) {
        console.error("❌ Error checking existing profile:", selectError);
      }
      
      if (existingProfile) {
        console.log("✅ Profile already exists, updating...");
        
        // Update existing profile
        const { error: updateError } = await supabase
          .from("student_profiles")
          .update({
            phone: phone,
            whatsapp: whatsapp,
            stage: answers.stage,
            exam: answers.exam,
            state: answers.state,
            need: answers.need,
            onboarding_data: answers,
            updated_at: new Date().toISOString()
          })
          .eq("user_id", user.id);
          
        if (updateError) {
          console.error("❌ Error updating profile:", updateError);
          return false;
        }
        
        console.log("✅ Profile updated successfully");
        return true;
      }
      
      // Create new profile
      console.log("📝 Creating new profile...");
      
      const profileData = {
        user_id: user.id,
        email: user.email,
        phone: phone,
        whatsapp: whatsapp,
        stage: answers.stage,
        exam: answers.exam,
        state: answers.state,
        need: answers.need,
        onboarding_data: answers,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("💾 Profile data to insert:", profileData);
      
      const { data: insertedData, error: insertError } = await supabase
        .from("student_profiles")
        .insert([profileData])
        .select();
        
      if (insertError) {
        console.error("❌ Database insert error:", insertError);
        console.error("❌ Error details:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code
        });
        return false;
      }
      
      console.log("✅ Profile saved to database:", insertedData);
      return true;
      
    } catch (err) {
      console.error("❌ Error saving onboarding data:", err);
      return false;
    }
  };

  // Check and save data when component mounts (in case user is already authenticated)
  useEffect(() => {
    const checkAndSaveData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("👤 User is already authenticated:", user.email);
          
          // Try to save onboarding data
          const saved = await saveOnboardingDataToDatabase(user);
          
          if (saved) {
            console.log("✅ Data saved successfully");
            localStorage.removeItem("saarathi_onboarding");
          }
        }
      } catch (err) {
        console.error("❌ Error in initial check:", err);
      }
    };
    
    checkAndSaveData();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth event:", event);
        
        if (event === "SIGNED_IN" && session?.user) {
          console.log("✅ User signed in:", session.user.email);
          
          // Wait a moment to ensure everything is ready
          setTimeout(async () => {
            const saved = await saveOnboardingDataToDatabase(session.user);
            
            if (saved) {
              console.log("✅ Onboarding data saved after sign in");
              localStorage.removeItem("saarathi_onboarding");
              
              // Redirect to dashboard after successful save
              setTimeout(() => {
                window.location.href = "/dashboard";
              }, 1000);
            }
          }, 1000);
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      console.log("📧 Sending OTP email to:", email);
      
      // Get onboarding data from localStorage
      const onboardingData = localStorage.getItem("saarathi_onboarding");
      console.log("📦 Current onboarding data:", onboardingData);
      
      if (!onboardingData) {
        console.warn("⚠️ No onboarding data found. User should complete signup first.");
        setError("Please complete the signup questions first.");
        setLoading(false);
        return;
      }
      
      const origin = window.location.origin;
      
      const { error: otpError } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          shouldCreateUser: true
        }
      });

      if (otpError) {
        console.error("❌ OTP send error:", otpError);
        setError(otpError.message);
      } else {
        console.log("✅ OTP email sent successfully");
        setMessage(`✅ Login link sent to ${email}! Check your inbox and click the link to continue.`);
        setEmail("");
      }
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && email && !loading) {
      handleLogin();
    }
  };

  // Debug function to manually trigger data save
  const manuallySaveData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("No user authenticated. Please sign in first.");
        return;
      }
      
      alert(`User: ${user.email}\nAttempting to save data...`);
      
      const saved = await saveOnboardingDataToDatabase(user);
      
      if (saved) {
        alert("✅ Data saved successfully!");
        localStorage.removeItem("saarathi_onboarding");
      } else {
        alert("❌ Failed to save data. Check console for details.");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Debug function to check database
  const checkDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from("student_profiles")
        .select("*");
        
      if (error) {
        console.error("❌ Database error:", error);
        alert(`Database error: ${error.message}`);
      } else {
        console.log("📊 Database contents:", data);
        alert(`Found ${data.length} profiles in database. Check console for details.`);
      }
    } catch (err) {
      console.error("❌ Check error:", err);
    }
  };

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleLogin}>
        <Title>Continue with email</Title>
        <Subtitle>No passwords needed. We'll send you a secure login link.</Subtitle>

        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
            setMessage(null);
          }}
          onKeyPress={handleKeyPress}
          placeholder="you@example.com"
          disabled={loading}
          autoComplete="email"
        />

        <Button 
          type="submit" 
          disabled={loading || !email || !email.includes("@")}
          onClick={handleLogin}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              Sending...
            </>
          ) : (
            "Send login link"
          )}
        </Button>
      </form>

      {message && <Message>{message}</Message>}
      {error && <Message error>{error}</Message>}
      
      {/* Debug buttons - remove in production */}
      <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
        <button 
          onClick={manuallySaveData}
          style={{
            flex: 1,
            background: "transparent",
            border: "1px solid #d1d5db",
            color: "#6b7280",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            cursor: "pointer"
          }}
        >
          Manually Save Data
        </button>
        
        <button 
          onClick={checkDatabase}
          style={{
            flex: 1,
            background: "transparent",
            border: "1px solid #d1d5db",
            color: "#6b7280",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            cursor: "pointer"
          }}
        >
          Check Database
        </button>
      </div>
      
      <div style={{ marginTop: "0.5rem" }}>
        <button 
          onClick={() => {
            const data = localStorage.getItem("saarathi_onboarding");
            alert(`LocalStorage data:\n${data || "No data found"}`);
          }}
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid #d1d5db",
            color: "#6b7280",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
            cursor: "pointer"
          }}
        >
          Check LocalStorage
        </button>
      </div>
      
      <Subtitle style={{ marginTop: "1.5rem", fontSize: "0.8rem", textAlign: "center" }}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Subtitle>
    </Card>
  );
}