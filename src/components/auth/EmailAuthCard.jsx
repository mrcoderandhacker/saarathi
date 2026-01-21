import { useState } from "react";
import { supabase } from "../../lib/supabase";
import styled from "styled-components";

const Card = styled.div`
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2.5rem;
  max-width: 420px;
  width: 100%;
`;

export default function EmailAuthCard() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

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
        <h2>Continue with email</h2>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? "Sending..." : "Send login link"}
        </button>
      </form>

      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Card>
  );
}
