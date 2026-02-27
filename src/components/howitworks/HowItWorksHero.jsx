import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Section = styled.section`
  padding: 5.5rem 1.5rem 4rem;
  background: #ffffff;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  gap: 3rem;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1.1fr;
  }
`;

const Left = styled.div``;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.8rem;
`;

const Title = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.2;
  color: #111827;
  margin-bottom: 1rem;

  @media (min-width: 768px) { font-size: 2.8rem; }
  @media (max-width: 640px) { font-size: 1.9rem; }
`;

const Subtitle = styled(motion.p)`
  font-size: 0.9rem;
  color: #6b7280;
  max-width: 420px;
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const CTARow = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #1f2937; transform: translateY(-1px); }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #f9fafb; }
`;

/* Right visual — stacked cards */
const VisualWrapper = styled(motion.div)`
  position: relative;
  height: 380px;

  @media (max-width: 899px) { height: 260px; }
`;

const VisualCard = styled.div`
  position: absolute;
  background: ${p => p.bg || 'white'};
  border-radius: 18px;
  border: 1px solid ${p => p.border || '#e2e8f0'};
  padding: 1rem 1.3rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.07);

  ${p => p.main && `
    left: 0; top: 0;
    width: 55%;
    min-height: 140px;
  `}

  ${p => p.secondary && `
    right: 0; top: 60px;
    width: 50%;
    min-height: 110px;
  `}

  ${p => p.accent && `
    left: 20px; bottom: 20px;
    width: 44%;
    min-height: 90px;
  `}

  @media (max-width: 899px) {
    ${p => p.main && `width: 50%; min-height: 110px;`}
    ${p => p.secondary && `width: 48%; min-height: 90px;`}
    ${p => p.accent && `display: none;`}
  }
`;

const CardLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.color || '#9ca3af'};
  margin-bottom: 0.4rem;
`;

const CardContent = styled.div`
  font-size: 0.8rem;
  color: #374151;
  line-height: 1.5;
`;

const DarkCard = styled.div`
  background: #111827;
  border-radius: 10px;
  padding: 0.5rem 0.8rem;
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.7);
  font-family: 'Courier New', monospace;
`;

export default function HowItWorksHero() {
  const navigate = useNavigate();

  return (
    <Section>
      <Container>
        <Left>
          <Label>How it works</Label>
          <Title
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Built as a growth system.
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            AI planning. Human mentorship. Structured execution. Every part of Saarathii is built to keep you moving forward — even on the difficult days.
          </Subtitle>

          <CTARow>
            <PrimaryBtn onClick={() => navigate("/signup")}>
              Get Started — it's free
            </PrimaryBtn>
            <SecondaryBtn onClick={() => navigate("/mentorship#gold-section")}>
              Get a Mentor
            </SecondaryBtn>
          </CTARow>
        </Left>

        {/* Right — stacked preview cards */}
        <VisualWrapper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <VisualCard main bg="white">
            <CardLabel color="#6366f1">Your Roadmap</CardLabel>
            <CardContent>
              Personalised 30/60/90 day plan — built for your timeline, exams, and goals. Not a template.
            </CardContent>
            <DarkCard>Week 3 · JEE Advanced prep · 4 tasks</DarkCard>
          </VisualCard>

          <VisualCard secondary bg="white">
            <CardLabel color="#10b981">Daily Check-in</CardLabel>
            <CardContent>
              Log your mood, track your streak, stay consistent.
            </CardContent>
            <DarkCard>Today: Good · Streak: 6 days</DarkCard>
          </VisualCard>

          <VisualCard accent bg="#0f172a" border="#0f172a">
            <CardLabel color="rgba(255,255,255,0.4)">AI Guide</CardLabel>
            <CardContent style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.75rem" }}>
              Saarathii AI is available anytime for instant guidance.
            </CardContent>
          </VisualCard>
        </VisualWrapper>
      </Container>
    </Section>
  );
}