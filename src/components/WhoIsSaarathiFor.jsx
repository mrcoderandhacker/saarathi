import { motion } from "framer-motion";
import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Section = styled.section`
  background: #f9fafb;
  padding: 6rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  max-width: 620px;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2.2rem;
  color: #111827;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 2rem;
  border: 1px solid #e5e7eb;
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }
`;

const CardTag = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #2563eb;
  background: #eff6ff;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  margin-bottom: 1rem;
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

export default function WhoIsSaarathiFor() {
  return (
    <Section>
      <Container>
        <Header>
          <Title>Who is Saarathi for?</Title>
          <Subtitle>
            Saarathi is designed for students standing at important
            crossroads — unsure, curious, or overwhelmed — and looking
            for clarity before taking the next step.
          </Subtitle>
        </Header>

        <Grid>
          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <CardTag>Class 10</CardTag>
            <CardTitle>Finding direction early</CardTitle>
            <CardText>
              For students stepping out of foundational schooling and
              wondering which stream, path, or future suits them best —
              without pressure or rush.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <CardTag>Class 11</CardTag>
            <CardTitle>Building strong foundations</CardTitle>
            <CardText>
              For students who have chosen a stream but want clarity,
              structure, and the right strategy to avoid confusion later.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CardTag>Class 12</CardTag>
            <CardTitle>Decisions that matter</CardTitle>
            <CardText>
              For students facing competitive exams, counselling rounds,
              and college choices — where one calm decision can change
              everything.
            </CardText>
          </Card>

          <Card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <CardTag>Drop Year</CardTag>
            <CardTitle>Regaining focus & confidence</CardTitle>
            <CardText>
              For students taking a pause to come back stronger — with
              the right mentorship, emotional support, and a clear plan
              forward.
            </CardText>
          </Card>
        </Grid>
      </Container>
    </Section>
  );
}
