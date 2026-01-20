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
`;

const Button = styled.button`
  width: 100%;
  background: ${({ disabled }) => (disabled ? "#9ca3af" : "#111827")};
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 999px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;

const Message = styled.p`
  font-size: 0.85rem;
  margin-top: 1rem;
  text-align: center;
  color: ${({ error }) => (error ? "#b91c1c" : "#065f46")};
`;

/* ------------------ COMPONENT ------------------ */

export default function EmailAuthCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const normalizePhone = (phone) => {
    if (!phone) return null;
    const digits = phone.replace(/\D/g, "");
    return digits.length === 10 ? `+91${digits}` : null;
  };

  const saveOnboardingDataToDatabase = async (user) => {
    const raw = localStorage.getItem("saarathi_onboarding");
    if (!raw) return;

    const answers = JSON.parse(raw);

    const phone = normalizePhone(answers.phone);
    const whatsapp = normalizePhone(answers.whatsapp) || phone;

    const { data: existing } = await supabase
      .from("student_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("student_profiles")
        .update({
          phone,
          whatsapp,
          stage: answers.stage,
          exam: answers.exam,
          state: answers.state,
          need: answers.need,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);
    } else {
      await supabase.from("student_profiles").insert([
        {
          user_id: user.id,
          email: user.email,
          phone,
          whatsapp,
          stage: answers.stage,
          exam: answers.exam,
          state: answers.state,
          need: answers.need,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    localStorage.removeItem("saarathi_onboarding");
  };

  useEffect(() => {
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          await saveOnboardingDataToDatabase(session.user);
        }
      });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://saarathi-beige.vercel.app/callback",
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) setError(error.message);
    else setMessage("Login link sent. Check your email.");
  };

  return (
    <Card>
      <form onSubmit={handleLogin}>
        <Title>Continue with email</Title>
        <Subtitle>No passwords needed.</Subtitle>

        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button disabled={!email || loading}>
          {loading ? "Sending..." : "Send login link"}
        </Button>
      </form>

      {message && <Message>{message}</Message>}
      {error && <Message error>{error}</Message>}
    </Card>
  );
}
