import { useState } from "react";
import { supabase } from "../../lib/supabase";
import styled from "styled-components";
import { motion } from "framer-motion";

/* ------------------ STYLES ------------------ */

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1.2rem;
  padding: 2rem 2rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
  max-width: 420px;
  width: 100%;
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 0.4rem;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.8rem;
  line-height: 1.6;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border-radius: 0.7rem;
  border: 1px solid #d1d5db;
  margin-bottom: 1rem;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

const ToggleText = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  text-align: center;
  margin-top: 1.5rem;
  
  span {
    color: #111827;
    font-weight: 600;
    cursor: pointer;
    margin-left: 0.3rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Button = styled.button`
  width: 100%;
  background: ${({ disabled }) => (disabled ? "#9ca3af" : "#111827")};
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ disabled }) => (disabled ? "#9ca3af" : "#1f2937")};
  }
`;

const Message = styled.p`
  font-size: 0.85rem;
  margin-top: 1.2rem;
  text-align: center;
  color: ${({ error }) => (error ? "#b91c1c" : "#065f46")};
`;

/* ------------------ COMPONENT ------------------ */

export default function EmailAuthCard({ isLoginView = false }) {
  const [isLogin, setIsLogin] = useState(isLoginView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLogin) {
        // Handle Login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        // Successful login will automatically trigger the onAuthStateChange listener in Navbar 
        // which then navigates or redirects as appropriate.
        window.location.href = "/dashboard";

      } else {
        // Handle Signup
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: "https://saarathi-beige.vercel.app/login", // Redirect to login on web check
          },
        });

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            // User already exists, try logging them in directly instead
            const { error: fallbackSignInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });

            if (fallbackSignInError) {
              throw new Error("Account exists, but password was incorrect. Please log in.");
            } else {
              // Ensure profile is created even if they logged in via fallback
              try {
                const storedAnswers = localStorage.getItem("saarathi_onboarding");
                if (storedAnswers) {
                  const answers = JSON.parse(storedAnswers);
                  const { data: { user } } = await supabase.auth.getUser();

                  if (user) {
                    await supabase.from("profiles").upsert({
                      id: user.id,
                      stage: answers.stage || null,
                      exam_prep: answers.exam || null,
                      emotional_state: answers.state || null,
                      primary_need: answers.need || null,
                      phone: answers.phone || null,
                      whatsapp: answers.whatsapp || null
                    }, { onConflict: 'id' }).select();

                    // Clear it so it doesn't overwrite again
                    localStorage.removeItem("saarathi_onboarding");
                  }
                }
              } catch (e) {
                console.error("Failed to save profile on fallback login", e);
              }

              window.location.href = "/dashboard";
              return;
            }
          } else {
            throw signUpError;
          }
        }

        // If signup was completely fresh and successful
        try {
          const storedAnswers = localStorage.getItem("saarathi_onboarding");
          if (storedAnswers && data?.user) {
            const answers = JSON.parse(storedAnswers);

            await supabase.from("profiles").insert({
              id: data.user.id,
              stage: answers.stage || null,
              exam_prep: answers.exam || null,
              emotional_state: answers.state || null,
              primary_need: answers.need || null,
              phone: answers.phone || null,
              whatsapp: answers.whatsapp || null
            });

            localStorage.removeItem("saarathi_onboarding");
          }
        } catch (e) {
          console.error("Failed to save fresh profile", e);
        }

        setSent(true);
        setMessage("Account created! ✨ Please check your email to verify your account before logging in.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent && !isLogin) {
    return (
      <Card
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ textAlign: "center" }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✉️</div>
        <Title>Verify Your Email</Title>
        <Subtitle>
          We've sent a verification link to <b>{email}</b>. Please check your inbox and click the link to activate your account.
        </Subtitle>
        <Button onClick={() => { setSent(false); setIsLogin(true); setEmail(""); setPassword(""); }}>
          Go to Login
        </Button>
      </Card>
    );
  }

  return (
    <Card
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleSubmit}>
        <Title>{isLogin ? "Welcome back" : "Create your account"}</Title>

        <Subtitle>
          {isLogin
            ? "Enter your details to access your dashboard."
            : "Sign up to start your personalized mentorship journey."}
        </Subtitle>

        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <Input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
        />

        <Button disabled={loading || !email || !password}>
          {loading
            ? "Please wait..."
            : isLogin
              ? "Sign In"
              : "Create Account"}
        </Button>
      </form>

      <ToggleText>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <span onClick={() => { setIsLogin(!isLogin); setError(null); setMessage(null); }}>
          {isLogin ? "Sign up" : "Log in"}
        </span>
      </ToggleText>

      {message && <Message>{message}</Message>}
      {error && <Message error>{error}</Message>}
    </Card>
  );
}
