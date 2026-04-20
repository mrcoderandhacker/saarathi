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
  line-height: 1.25;
  max-width: 540px;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: white;
  border-radius: 18px;
  padding: 1.6rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 3px;
    background: ${p => p.accent};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: scaleX(1);
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(0,0,0,0.07);
    transform: translateY(-2px);
  }
`;

const StageTag = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${p => p.color};
  background: ${p => p.bg};
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 4px;
  margin-bottom: 0.8rem;
  letter-spacing: 0.04em;
`;

const StageImage = styled.div`
  width: 100%;
  height: 150px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 1.2rem;
  overflow: hidden;
  position: relative;
`;

const StageImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const CardText = styled.p`
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.65;
`;

const STAGES = [
  {
    tag: "Class 10",
    title: "Finding direction early",
    image: "/images/stages/class-10.jpg",
    text: "Stepping out of foundational schooling and wondering which stream suits you — without pressure or rush.",
    accent: "#6366f1",
    tagColor: "#4f46e5",
    tagBg: "#ede9fe",
  },
  {
    tag: "Class 11",
    title: "Building strong foundations",
    image: "/images/stages/class-11.png",
    text: "You've chosen a stream. Now build the clarity, structure, and strategy to avoid confusion later.",
    accent: "#3b82f6",
    tagColor: "#1d4ed8",
    tagBg: "#dbeafe",
  },
  {
    tag: "Class 12",
    title: "Decisions that matter",
    image: "/images/stages/class-12.png",
    text: "Facing competitive exams, counselling rounds, college choices — where one calm decision changes everything.",
    accent: "#f59e0b",
    tagColor: "#d97706",
    tagBg: "#fef3c7",
  },
  {
    tag: "Drop Year",
    title: "Regaining focus",
    image: "/images/stages/drop-year.png",
    text: "Taking a pause to come back stronger — with the right mentorship, emotional support, and a clear plan forward.",
    accent: "#10b981",
    tagColor: "#059669",
    tagBg: "#d1fae5",
  },
];

export default function WhoIsSaarathiFor() {
  return (
    <Section>
      <Container>
        <Header>
          <Label>Who it's for</Label>
          <Title
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Designed for students standing at important crossroads.
          </Title>
        </Header>

        <Grid>
          {STAGES.map((s, i) => (
            <Card
              key={s.tag}
              accent={s.accent}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <StageImage>
                <StageImg src={s.image} alt={s.tag} />
              </StageImage>
              <StageTag color={s.tagColor} bg={s.tagBg}>{s.tag}</StageTag>
              <CardTitle>{s.title}</CardTitle>
              <CardText>{s.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
