import { motion } from "framer-motion";
import styled from "styled-components";

const Section = styled.section`
  background: #0f172a;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  max-width: 620px;
  margin-bottom: 3.5rem;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 0.8rem;
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 2.4rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1px;
  background: rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: #0f172a;
  padding: 2rem;
  position: relative;
  transition: background 0.25s;

  &:hover {
    background: rgba(255,255,255,0.04);
  }
`;

const CardNumber = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.2);
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.6rem;
  line-height: 1.3;
`;

const CardText = styled.p`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
`;

const PILLARS = [
  {
    title: "Clarity over confusion",
    text: "We help you understand your strengths, options, and possibilities — so your decisions feel informed, calm, and truly your own.",
  },
  {
    title: "Mentors who've walked the path",
    text: "Our mentors are people who have already faced these decisions. They guide from lived experience — not theory or textbooks.",
  },
  {
    title: "Support beyond academics",
    text: "Saarathii supports not just your studies but your mindset and emotional well-being — because clarity begins with calm.",
  },
];

export default function WhySaarathi() {
  return (
    <Section>
      <Container>
        <Header>
          <Label>Why Saarathii</Label>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Choosing your future shouldn't feel rushed, confusing, or lonely.
          </Title>
          <Subtitle>
            Saarathii exists to give students clarity, confidence, and steady guidance at the moments that matter most.
          </Subtitle>
        </Header>

        <Grid>
          {PILLARS.map((p, i) => (
            <Card
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <CardNumber>0{i + 1}</CardNumber>
              <CardTitle>{p.title}</CardTitle>
              <CardText>{p.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
