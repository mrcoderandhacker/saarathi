import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  background: white;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3.5rem;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.8rem;
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #111827;
  max-width: 480px;
  line-height: 1.25;

  @media (min-width: 768px) { font-size: 2.2rem; }
`;

/* Timeline */
const Timeline = styled.div`
  position: relative;
  padding-left: 2rem;

  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 12px;
    bottom: 12px;
    width: 1px;
    background: linear-gradient(180deg, #6366f1, #a78bfa, #e2e8f0);
  }
`;

const Step = styled(motion.div)`
  position: relative;
  padding: 0 0 2.5rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  &:last-child { padding-bottom: 0; }
`;

const StepDot = styled.div`
  position: absolute;
  left: -1.9rem;
  top: 4px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${p => p.color || '#6366f1'};
  border: 2px solid white;
  box-shadow: 0 0 0 3px ${p => p.color || '#6366f1'}30;
`;

const StepText = styled.div``;

const StepNum = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #d1d5db;
  margin-bottom: 0.35rem;
`;

const StepTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.4rem;
  line-height: 1.3;
`;

const StepBody = styled.p`
  font-size: 0.83rem;
  color: #6b7280;
  line-height: 1.65;
`;

const StepVisual = styled.div`
  background: ${p => p.bg || '#f8fafc'};
  border-radius: 12px;
  padding: 1rem 1.2rem;
  font-size: 0.78rem;
  color: ${p => p.color || '#6366f1'};
  font-weight: 500;
  line-height: 1.6;
  border: 1px solid ${p => p.border || '#e2e8f0'};
  display: none;

  @media (min-width: 640px) { display: block; }
`;

const STEPS = [
    {
        num: "Step 01",
        title: "We match you with the right mentor",
        body: "After your Gold request, our team calls you within 24 hours. We ask about your exams, goals, and challenges — then personally match you with a mentor who's been through the same path.",
        color: "#6366f1",
        bg: "#ede9fe",
        textColor: "#4f46e5",
        border: "#ddd6fe",
        visual: "Profile review\nGoals discussion\nMentor matching"
    },
    {
        num: "Step 02",
        title: "Your first session — no agenda",
        body: "The first session is a conversation, not a lecture. Your mentor gets to know you — your fears, interests, current plan, and what's been confusing. No pressure, just clarity.",
        color: "#3b82f6",
        bg: "#dbeafe",
        textColor: "#1d4ed8",
        border: "#bfdbfe",
        visual: "First 1:1 session\nCareer exploration\nPersonal clarity"
    },
    {
        num: "Step 03",
        title: "Build your personal roadmap",
        body: "Your mentor builds a 30/60/90-day roadmap tailored to your timeline and goal — study plan, milestones, key decisions. You'll see it on your dashboard.",
        color: "#f59e0b",
        bg: "#fef3c7",
        textColor: "#d97706",
        border: "#fde68a",
        visual: "30/60/90 day plan\nStudy milestones\nDecision checkpoints"
    },
    {
        num: "Step 04",
        title: "Ongoing check-ins and adjustments",
        body: "Life changes. So should your plan. Your mentor reviews your dashboard every week, sees your progress, and adjusts the roadmap when needed. They also stay reachable between sessions.",
        color: "#10b981",
        bg: "#d1fae5",
        textColor: "#059669",
        border: "#a7f3d0",
        visual: "Weekly reviews\nDashboard tracking\nWhatsApp access"
    },
];

export default function MentorshipTimeline() {
    return (
        <Section>
            <Container>
                <Header>
                    <Label>How it works</Label>
                    <Title
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        How the mentor relationship works.
                    </Title>
                </Header>

                <Timeline>
                    {STEPS.map((s, i) => (
                        <Step
                            key={s.num}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.1 }}
                        >
                            <StepDot color={s.color} />
                            <StepText>
                                <StepNum>{s.num}</StepNum>
                                <StepTitle>{s.title}</StepTitle>
                                <StepBody>{s.body}</StepBody>
                            </StepText>
                            <StepVisual bg={s.bg} color={s.textColor} border={s.border}>
                                {s.visual}
                            </StepVisual>
                        </Step>
                    ))}
                </Timeline>
            </Container>
        </Section>
    );
}
