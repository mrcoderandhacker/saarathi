import { motion } from "framer-motion";
import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Section = styled.section`
  background: #ffffff;
  padding: 6rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  max-width: 640px;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2.3rem;
  color: #111827;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: #f9fafb;
  border-radius: 1.25rem;
  padding: 2.2rem;
  border: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

const CardText = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.65;
`;

/* ------------------ COMPONENT ------------------ */

export default function WhySaarathi() {
  return (
    <Section>
      <Container>
        <Header>
          <Title>Why Saarathi?</Title>
          <Subtitle>
            Because choosing your future shouldn’t feel rushed,
            confusing, or lonely. Saarathi exists to give students
            clarity, confidence, and steady guidance when it matters
            the most.
          </Subtitle>
        </Header>

        <Grid>
          <Card
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CardTitle>Clarity over confusion</CardTitle>
            <CardText>
              We help you understand your strengths, options, and
              possibilities clearly — so your decisions feel informed,
              calm, and truly your own.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CardTitle>Mentors who’ve walked the path</CardTitle>
            <CardText>
              Our mentors are students and professionals who have already
              faced these decisions themselves. They guide from
              experience — not theory.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardTitle>Support beyond academics</CardTitle>
            <CardText>
              Saarathi supports not just your studies, but your mindset,
              confidence, and emotional well-being — because clarity
              begins with calm.
            </CardText>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
}
