import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 1.5rem;
  max-width: 520px;
  text-align: center;
`;

export default function Callback() {
  useEffect(() => {
    const finishSignup = async () => {
      try {
        // 1️⃣ Get auth code from URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          console.error("No auth code found");
          return;
        }

        // 2️⃣ Exchange code for session (CRITICAL)
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Auth exchange failed:", error.message);
          return;
        }

        const user = data?.session?.user;
        if (!user) {
          console.error("User not found after exchange");
          return;
        }

        // 3️⃣ Read onboarding data
        const raw = localStorage.getItem("saarathi_onboarding");
        if (!raw) {
          console.warn("No onboarding data found");
          return;
        }

        const answers = JSON.parse(raw);

        const normalize = (v) =>
          v ? `+91${v.replace(/\D/g, "")}` : null;

        // 4️⃣ UPSERT profile (safe + idempotent)
        const { error: dbError } = await supabase
          .from("student_profiles")
          .upsert(
            {
              user_id: user.id,
              email: user.email,
              phone: normalize(answers.phone),
              whatsapp:
                normalize(answers.whatsapp) ||
                normalize(answers.phone),
              stage: answers.stage ?? null,
              exam: answers.exam ?? null,
              state: answers.state ?? null,
              need: answers.need ?? null,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (dbError) {
          console.error("DB save failed:", dbError.message);
          return;
        }

        // 5️⃣ Cleanup
        localStorage.removeItem("saarathi_onboarding");

        // 6️⃣ Redirect
        window.location.replace("/contact-soon");
      } catch (err) {
        console.error("Callback error:", err);
      }
    };

    finishSignup();
  }, []);

  return (
    <Wrapper>
      <Card>
        <h1>We’ll contact you soon ✨</h1>
        <p>
          Thank you for trusting Saarathi.  
          Our mentors will reach out shortly.
        </p>
      </Card>
    </Wrapper>
  );
}
