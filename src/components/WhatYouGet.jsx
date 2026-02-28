import { motion } from "framer-motion";
import styled from "styled-components";

const Section = styled.section`
  background: #f8fafc;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 3rem;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.7rem;
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 1.9rem;
  color: #111827;
  max-width: 490px;
  line-height: 1.25;

  @media (min-width: 768px) { font-size: 2.2rem; }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
`;

const Item = styled(motion.div)`
  background: white;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;

  @media (min-width: 768px) {
    grid-template-columns: ${p => p.flip ? '1fr 1fr' : '1fr 1fr'};
  }

  &:hover .item-bg {
    opacity: 1;
  }
`;

const ItemText = styled.div`
  padding: 2rem;
  order: ${p => p.flip ? 2 : 1};

  @media (max-width: 767px) { order: 1; }
`;

const ItemNum = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #d1d5db;
  margin-bottom: 0.6rem;
`;

const ItemTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const ItemBody = styled.p`
  font-size: 0.83rem;
  color: #6b7280;
  line-height: 1.65;
`;

const ItemVisual = styled.div`
  background: ${p => p.bg || '#f8fafc'};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  order: ${p => p.flip ? 1 : 2};
  min-height: 250px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '📸 Image Placeholder (Feature Demo)';
    position: absolute;
    inset: 10%;
    border: 2px dashed rgba(0,0,0,0.15);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(0,0,0,0.3);
  }

  @media (max-width: 767px) { order: 2; min-height: 200px; }
`;

const VisualTag = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${p => p.color || '#6366f1'};
  background: ${p => p.bg || 'rgba(99,102,241,0.1)'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-align: center;
  line-height: 1.5;
`;

const ITEMS = [
  {
    num: "01",
    title: "Weekly 1-on-1 mentorship",
    text: "Personal sessions with a dedicated mentor who understands your goals, challenges, and progress — not generic advice for everyone.",
    bg: "#ede9fe",
    visual: { text: "Your mentor · Your goals\nYour timeline", color: "#7c3aed", bg: "rgba(139,92,246,0.1)" }
  },
  {
    num: "02",
    title: "Counselling and college guidance",
    text: "Step-by-step support through counselling rounds, college selection, and applications — without the confusion.",
    bg: "#dbeafe",
    visual: { text: "College fit\nCounselling rounds\nApplication strategy", color: "#1d4ed8", bg: "rgba(59,130,246,0.08)" },
    flip: true
  },
  {
    num: "03",
    title: "Personalised study and exam strategy",
    text: "Study plans designed around your strengths, weaknesses, and timeline — not one-size-fits-all templates.",
    bg: "#d1fae5",
    visual: { text: "Tailored to you\nNot a template", color: "#059669", bg: "rgba(16,185,129,0.08)" }
  },
  {
    num: "04",
    title: "Emotional and mental well-being",
    text: "Guidance to manage stress, self-doubt, and pressure. Because mental clarity is as important as academic strength.",
    bg: "#fef3c7",
    visual: { text: "Daily check-in\nJournal\nLife balance", color: "#d97706", bg: "rgba(245,158,11,0.08)" },
    flip: true
  },
  {
    num: "05",
    title: "Progress tracking and assessments",
    text: "Regular check-ins to track improvement, identify gaps early, and adjust your strategies before it's too late.",
    bg: "#f0fdf4",
    visual: { text: "Weekly report\nStreak · Life Score", color: "#15803d", bg: "rgba(22,163,74,0.08)" }
  },
  {
    num: "06",
    title: "Industry exposure and expert sessions",
    text: "Interactions with professionals to understand real-world careers beyond textbooks and exam ranks.",
    bg: "#f5f3ff",
    visual: { text: "Real careers\nReal people", color: "#6d28d9", bg: "rgba(109,40,217,0.08)" },
    flip: true
  },
];

export default function WhatYouGet() {
  return (
    <Section>
      <Container>
        <Header>
          <Label>What you get</Label>
          <Title
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Not a one-time service. A continuous mentorship journey.
          </Title>
        </Header>

        <List>
          {ITEMS.map((item, i) => (
            <Item
              key={item.num}
              flip={item.flip}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
            >
              <ItemText flip={item.flip}>
                <ItemNum>{item.num}</ItemNum>
                <ItemTitle>{item.title}</ItemTitle>
                <ItemBody>{item.text}</ItemBody>
              </ItemText>
              <ItemVisual bg={item.bg} flip={item.flip}>
                <VisualTag color={item.visual.color} bg={item.visual.bg}>
                  {item.visual.text}
                </VisualTag>
              </ItemVisual>
            </Item>
          ))}
        </List>
      </Container>
    </Section>
  );
}
