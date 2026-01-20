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

export default function ContactSoon() {
  useEffect(() => {
    const saveProfile = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;

      if (!user) return;

      const raw = localStorage.getItem("saarathi_onboarding");
      if (!raw) return;

      const answers = JSON.parse(raw);

      const normalize = (v) =>
        v ? `+91${v.replace(/\D/g, "")}` : null;

      const { error } = await supabase
        .from("student_profiles")
        .insert([
          {
            user_id: user.id,
            email: user.email,
            phone: normalize(answers.phone),
            whatsapp: normalize(answers.whatsapp),
            stage: answers.stage,
            exam: answers.exam,
            state: answers.state,
            need: answers.need,
          },
        ]);

      if (!error) {
        localStorage.removeItem("saarathi_onboarding");
      } else {
        console.error("DB insert failed:", error.message);
      }
    };

    saveProfile();
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
