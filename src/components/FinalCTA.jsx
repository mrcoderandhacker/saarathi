import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Section = styled.section`
  background: #0f172a;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 1rem;
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 1rem;
  line-height: 1.25;

  @media (min-width: 768px) { font-size: 2.5rem; }
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 2.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: white;
  color: #0f172a;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255,255,255,0.15);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.8rem 2rem;
  border-radius: 999px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255,255,255,0.5);
    color: white;
  }
`;

const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: rgba(255,255,255,0.12);
  margin: 2rem auto;
`;

const NoteText = styled.p`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.3);
  line-height: 1.6;
  max-width: 480px;
  margin: 0 auto;
`;

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <Section>
      <Container>
        <Label>Get started</Label>
        <Title
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Ready to move forward with clarity?
        </Title>
        <Subtitle>
          You don't have to figure everything out today. You just need the right guidance to take the next step — and Saarathii is here to walk with you.
        </Subtitle>

        <ButtonRow>
          <PrimaryButton onClick={() => navigate("/signup")}>
            Join Saarathii — it's free
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate("/how-it-works")}>
            How it works
          </SecondaryButton>
        </ButtonRow>

        <Divider />

        <NoteText>
          The full mentor experience is available with Saarathii Gold — fill a short form and our team will match you with the right person within 24 hours.
        </NoteText>
      </Container>
    </Section>
  );
}
