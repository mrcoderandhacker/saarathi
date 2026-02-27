import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  background: #0f172a;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
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
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.8rem;
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: white;
  max-width: 520px;
  line-height: 1.25;
  margin-bottom: 0.7rem;

  @media (min-width: 768px) { font-size: 2.3rem; }
`;

const Sub = styled.p`
  font-size: 0.88rem;
  color: rgba(255,255,255,0.45);
  max-width: 480px;
  line-height: 1.65;
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
  transition: background 0.2s;

  &:hover { background: rgba(255,255,255,0.04); }
`;

const CardNum = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.2);
  margin-bottom: 0.8rem;
`;

const AccentLine = styled.div`
  width: 28px;
  height: 2px;
  background: ${p => p.color || '#6366f1'};
  border-radius: 999px;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.6rem;
  line-height: 1.3;
`;

const CardText = styled.p`
  font-size: 0.83rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.65;
`;

const ROLES = [
  {
    num: "01",
    title: "Clarity before commitment",
    text: "We help you understand your strengths, personality, and long-term compatibility before choosing any path. No pressure, no guessing.",
    color: "#818cf8",
  },
  {
    num: "02",
    title: "Future intelligence",
    text: "We analyse industries — engineering, medicine, business, arts, tech — and explain real scope, stability, and evolution. Not what YouTube says.",
    color: "#34d399",
  },
  {
    num: "03",
    title: "Structured roadmap",
    text: "Once your direction is clear, we build a step-by-step academic and skill roadmap — tailored entirely to you, not a template.",
    color: "#fbbf24",
  },
];

export default function MentorshipRole() {
  return (
    <Section>
      <Container>
        <Header>
          <Label>Saarathii's role</Label>
          <Title
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            We act as your strategic thinking partner.
          </Title>
          <Sub>Not just exam mentors — clarity architects who stay with you until the right decision is made.</Sub>
        </Header>

        <Grid>
          {ROLES.map((r, i) => (
            <Card
              key={r.num}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <CardNum>{r.num}</CardNum>
              <AccentLine color={r.color} />
              <CardTitle>{r.title}</CardTitle>
              <CardText>{r.text}</CardText>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}