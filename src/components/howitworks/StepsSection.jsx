import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Section = styled.section`
  background: #f8fafc;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

/* Phase header */
const PhaseBlock = styled.div`
  margin-bottom: 4rem;
`;

const PhaseLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.6rem;
`;

const PhaseTitle = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: #111827;
  margin-bottom: 0.5rem;
  max-width: 500px;
  line-height: 1.25;
`;

const PhaseSub = styled.p`
  font-size: 0.88rem;
  color: #6b7280;
  max-width: 500px;
  line-height: 1.65;
  margin-bottom: 2rem;
`;

const StepGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: ${p => p.cols === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'};
  }
`;

const StepCard = styled(motion.div)`
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  position: relative;

  &::before {
    content: '${p => p.num}';
    position: absolute;
    top: 1.2rem; right: 1.2rem;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: #e2e8f0;
  }
`;

const StepTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.4rem;
  line-height: 1.3;
`;

const StepText = styled.p`
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.65;
`;

const AccentLine = styled.div`
  width: 24px;
  height: 2px;
  background: ${p => p.color || '#6366f1'};
  border-radius: 999px;
  margin-bottom: 0.8rem;
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 3.5rem 0;
`;

/* Free vs Gold */
const CompareGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const TierCard = styled(motion.div)`
  background: ${p => p.dark ? '#0f172a' : 'white'};
  border-radius: 20px;
  padding: 1.8rem;
  border: ${p => p.dark ? 'none' : '1px solid #e2e8f0'};
`;

const TierName = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.dark ? 'rgba(255,255,255,0.4)' : '#9ca3af'};
  margin-bottom: 0.6rem;
`;

const TierTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${p => p.dark ? 'white' : '#111827'};
  margin-bottom: 0.3rem;
`;

const TierSub = styled.p`
  font-size: 0.8rem;
  color: ${p => p.dark ? 'rgba(255,255,255,0.45)' : '#6b7280'};
  margin-bottom: 1.2rem;
  line-height: 1.5;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FeatureItem = styled.div`
  font-size: 0.82rem;
  color: ${p => p.dark ? 'rgba(255,255,255,0.65)' : '#374151'};
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.4;

  &::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: ${p => p.dark ? '#f59e0b' : '#6366f1'};
    margin-top: 5px;
    flex-shrink: 0;
  }
`;

const TierCTA = styled.button`
  width: 100%;
  background: ${p => p.gold ? 'linear-gradient(135deg, #f59e0b, #d97706)' : '#f8fafc'};
  color: ${p => p.gold ? 'white' : '#374151'};
  border: ${p => p.gold ? 'none' : '1px solid #e2e8f0'};
  border-radius: 12px;
  padding: 0.7rem;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.2s;

  &:hover { opacity: 0.9; transform: translateY(-1px); }
`;

const FREE_FEATURES = [
  "AI Chat — ask anything, anytime",
  "Dashboard with goals and daily routine",
  "Streak tracker and life score",
  "Journal with mood tracking",
  "Career discovery quiz",
  "Explore 8 career paths",
  "Scholarship finder",
  "2026 Exam calendar",
  "College Explorer",
];

const GOLD_FEATURES = [
  "Everything in Free",
  "Personally matched human mentor",
  "Weekly 1-on-1 sessions",
  "Mentor sees your dashboard and progress",
  "WhatsApp access between sessions",
  "Personalised 30/60/90 day roadmap",
  "Session notes and action items",
  "College counselling support",
  "Parent progress updates",
];

const FREE_STEPS = [
  { num: "01", title: "Sign up", text: "Create your free account. No credit card, no commitment.", color: "#6366f1" },
  { num: "02", title: "Set up your dashboard", text: "Add your exam target, set goals, and build your daily routine. Takes 5 minutes.", color: "#3b82f6" },
  { num: "03", title: "Take the career quiz", text: "Find out what kind of path fits your strengths and interests.", color: "#8b5cf6" },
  { num: "04", title: "Use the tools daily", text: "Log your mood, track tasks, explore colleges, and find scholarships.", color: "#10b981" },
];

const GOLD_STEPS = [
  { num: "01", title: "Fill the interest form", text: "Takes 2 minutes. Tell us your biggest challenge and what you're preparing for.", color: "#f59e0b" },
  { num: "02", title: "We call you in 24 hours", text: "Our team calls to understand your situation and find the right mentor match.", color: "#f59e0b" },
  { num: "03", title: "Meet your mentor", text: "First session is a conversation — no pressure. Just full clarity for 45 minutes.", color: "#f59e0b" },
];

export default function StepsSection() {
  const navigate = useNavigate();

  return (
    <Section>
      <Container>
        {/* Free Path */}
        <PhaseBlock>
          <PhaseLabel>Free — for everyone</PhaseLabel>
          <PhaseTitle
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Start for free in 4 steps.
          </PhaseTitle>
          <PhaseSub>
            No credit card. No mentor required. Just sign up and start building clarity.
          </PhaseSub>
          <StepGrid>
            {FREE_STEPS.map((s, i) => (
              <StepCard
                key={s.num}
                num={s.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <AccentLine color={s.color} />
                <StepTitle>{s.title}</StepTitle>
                <StepText>{s.text}</StepText>
              </StepCard>
            ))}
          </StepGrid>
        </PhaseBlock>

        <Divider />

        {/* Gold Path */}
        <PhaseBlock>
          <PhaseLabel>Saarathii Gold — with a real mentor</PhaseLabel>
          <PhaseTitle
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Get your mentor in 3 steps.
          </PhaseTitle>
          <PhaseSub>
            No subscription to start — just fill a form and we handle the rest.
          </PhaseSub>
          <StepGrid cols={3}>
            {GOLD_STEPS.map((s, i) => (
              <StepCard
                key={s.num}
                num={s.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.09 }}
              >
                <AccentLine color={s.color} />
                <StepTitle>{s.title}</StepTitle>
                <StepText>{s.text}</StepText>
              </StepCard>
            ))}
          </StepGrid>
        </PhaseBlock>

        <Divider />

        {/* Free vs Gold comparison */}
        <PhaseLabel>What's included</PhaseLabel>
        <PhaseTitle
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: '1.5rem' }}
        >
          Free vs Saarathii Gold.
        </PhaseTitle>

        <CompareGrid>
          <TierCard
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <TierName>Free plan</TierName>
            <TierTitle>Saarathii Free</TierTitle>
            <TierSub>Everything you need to get started and build clarity on your own.</TierSub>
            <FeatureList>
              {FREE_FEATURES.map(f => <FeatureItem key={f}>{f}</FeatureItem>)}
            </FeatureList>
            <TierCTA onClick={() => navigate("/signup")}>Get started free →</TierCTA>
          </TierCard>

          <TierCard
            dark
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.07 }}
          >
            <TierName dark>Gold plan</TierName>
            <TierTitle dark>Saarathii Gold</TierTitle>
            <TierSub dark>A real mentor, personally matched to you. The full experience.</TierSub>
            <FeatureList>
              {GOLD_FEATURES.map(f => <FeatureItem key={f} dark>{f}</FeatureItem>)}
            </FeatureList>
            <TierCTA gold onClick={() => navigate("/mentorship#gold-section")}>
              Request my mentor →
            </TierCTA>
          </TierCard>
        </CompareGrid>
      </Container>
    </Section>
  );
}