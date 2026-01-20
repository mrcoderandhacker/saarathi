import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

/* ------------------ STYLES ------------------ */

const Section = styled.section`
  background: linear-gradient(
    to bottom,
    #eef2ff 0%,
    #f8fafc 60%,
    #ffffff 100%
  );
  padding: 7rem 1.5rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1.75rem;
  padding: 4rem 3rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 40px 80px rgba(0, 0, 0, 0.08);

  @media (max-width: 640px) {
    padding: 3rem 2rem;
  }
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2.4rem;
  color: #111827;
  margin-bottom: 1.2rem;
`;

const Subtitle = styled.p`
  font-size: 1.05rem;
  color: #4b5563;
  line-height: 1.7;
  max-width: 650px;
  margin: 0 auto 2.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: #111827;
  color: #ffffff;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  transition: background 0.25s ease;

  &:hover {
    background: #1f2937;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  transition: background 0.25s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

/* ------------------ COMPONENT ------------------ */

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <Section>
      <Container>
        <Card
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Title>Ready to move forward with clarity?</Title>

          <Subtitle>
            You don’t have to figure everything out today.  
            You just need the right guidance to take the next step —
            and Saarathi is here to walk with you until you succeed.
          </Subtitle>

          <ButtonRow>
            <PrimaryButton onClick={() => navigate("/signup")}>
              Join Saarathi
            </PrimaryButton>

            <SecondaryButton>
              Talk to a Mentor
            </SecondaryButton>
          </ButtonRow>
        </Card>
      </Container>
    </Section>
  );
}
