import { useState } from "react";
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
  line-height: 1.6;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #d1d5db;
  margin-bottom: 1.2rem;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

const Button = styled.button`
  width: 100%;
  background: ${({ disabled }) => (disabled ? "#9ca3af" : "#111827")};
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 999px;
  font-size: 0.95rem;
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

export default function EmailAuthCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          "https://saarathi-beige.vercel.app/callback",
        shouldCreateUser: true,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
      setMessage(
        "Login link sent ✨ Please open the link to complete your signup"
      );
    }
  };

  return (
    <Card
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleLogin}>
        <Title>Continue with email</Title>

        <Subtitle>
          We’ll send you a secure login link.  
          No passwords needed.
        </Subtitle>

        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <Button disabled={loading || !email}>
          {loading
            ? "Sending..."
            : sent
            ? "Resend login link"
            : "Send login link"}
        </Button>
      </form>

      {message && <Message>{message}</Message>}
      {error && <Message error>{error}</Message>}
    </Card>
  );
}
