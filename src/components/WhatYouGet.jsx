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
  max-width: 650px;
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
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: #f9fafb;
  border-radius: 1.25rem;
  padding: 2.2rem;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 18px 36px rgba(0, 0, 0, 0.08);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.6rem;
`;

const CardText = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
`;

/* ------------------ COMPONENT ------------------ */

export default function WhatYouGet() {
  return (
    <Section>
      <Container>
        <Header>
          <Title>What you get with Saarathi</Title>
          <Subtitle>
            Saarathi is not a one-time service. It is a continuous
            mentorship journey designed to support you academically,
            emotionally, and strategically until you reach the right
            college.
          </Subtitle>
        </Header>

        <Grid>
          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CardTitle>Weekly 1-on-1 mentorship</CardTitle>
            <CardText>
              Personal sessions with a dedicated mentor who understands
              your goals, challenges, and progress — not generic advice.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CardTitle>Counselling & college guidance</CardTitle>
            <CardText>
              Step-by-step support through counselling rounds, college
              selection, applications, and decision-making without
              confusion.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardTitle>Personalised study & exam strategy</CardTitle>
            <CardText>
              Study plans and exam strategies designed around your
              strengths, weaknesses, and timeline — not one-size-fits-all.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CardTitle>Performance tracking & assessments</CardTitle>
            <CardText>
              Regular check-ins and assessments to track improvement,
              identify gaps early, and adjust strategies before it’s too
              late.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CardTitle>Emotional & mental well-being support</CardTitle>
            <CardText>
              Guidance to manage stress, self-doubt, and pressure —
              because mental clarity is as important as academic strength.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <CardTitle>Industry exposure & expert sessions</CardTitle>
            <CardText>
              Interactions with industry experts and professionals to
              understand real-world careers beyond textbooks and exams.
            </CardText>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
}
