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
  background: #111827;
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 999px;
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
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErr(null);
    setMsg(null);

    const origin = window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${origin}/callback`,
      },
    });

    setLoading(false);

    if (error) setErr(error.message);
    else setMsg("Login link sent. Please check your email.");
  };

  return (
    <Card>
      <form onSubmit={handleLogin}>
        <Title>Continue with email</Title>
        <Subtitle>No passwords. Secure login.</Subtitle>

        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <Button disabled={!email || loading}>
          {loading ? "Sending..." : "Send login link"}
        </Button>
      </form>

      {msg && <Message>{msg}</Message>}
      {err && <Message error>{err}</Message>}
    </Card>
  );
}
