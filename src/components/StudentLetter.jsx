import { motion } from "framer-motion";
import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Section = styled.section`
  background: #f7f8fb;
  padding: 7rem 1.5rem;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const LetterCard = styled(motion.div)`
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 3rem 2.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.06);

  @media (max-width: 640px) {
    padding: 2.2rem 1.8rem;
  }
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2.1rem;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const Paragraph = styled.p`
  font-size: 1rem;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 1.2rem;
`;

const Highlight = styled.span`
  font-weight: 500;
  color: #111827;
`;

const Signature = styled.div`
  margin-top: 2.5rem;
  font-size: 0.95rem;
  color: #374151;
`;

const Name = styled.div`
  margin-top: 0.3rem;
  font-weight: 600;
  color: #111827;
`;

/* ------------------ COMPONENT ------------------ */

export default function StudentLetter() {
  return (
    <Section>
      <Container>
        <LetterCard
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Title>Dear Student,</Title>

          <Paragraph>
            First of all, <Highlight>congratulations</Highlight> on reaching
            this stage of your journey. Whether you have just completed your
            10th or 12th grade, are preparing for competitive exams, or are
            taking a drop year — know that what you are feeling right now is
            completely normal.
          </Paragraph>

          <Paragraph>
            Confusion, pressure, self-doubt, and the fear of making the wrong
            decision often arrive together at this point. Everyone expects
            you to have answers — but very few people actually help you
            <Highlight> find them calmly</Highlight>.
          </Paragraph>

          <Paragraph>
            That is why Saarathi exists.
          </Paragraph>

          <Paragraph>
            We are here to <Highlight>walk with you</Highlight> — not push you,
            not judge you, and not leave you halfway. Whether your path feels
            clear today or uncertain, you do not have to figure it out alone.
          </Paragraph>

          <Paragraph>
            With the right mentorship, clarity comes naturally. Confidence
            grows. Decisions stop feeling scary. And slowly, you begin to
            trust yourself again.
          </Paragraph>

          <Paragraph>
            <Highlight>
              Saarathi will stay with you until you reach the right college —
              and more importantly, until you believe in your own journey.
            </Highlight>
          </Paragraph>

          <Signature>
            With care and belief in you,
            <Name>Saarathi Mentorship Team</Name>
          </Signature>
        </LetterCard>
      </Container>
    </Section>
  );
}
