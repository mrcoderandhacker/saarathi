import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  background: #f8fafc;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  color: #94a3b8;
  font-size: 0.85rem;
  text-align: center;
  padding: 2rem;
  order: 2;

  @media (min-width: 900px) { order: 1; }
`;

const PlaceholderLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #cbd5e1;
`;

const TextBlock = styled.div`
  order: 1;

  @media (min-width: 900px) { order: 2; }
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
  margin-bottom: 1rem;
  line-height: 1.25;

  @media (min-width: 768px) { font-size: 2.3rem; }
`;

const LeadText = styled.p`
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1.5rem;
`;

const QuoteGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const QuoteCard = styled(motion.div)`
  background: white;
  border-left: 3px solid ${p => p.accent || '#e2e8f0'};
  border-radius: 0 12px 12px 0;
  padding: 0.9rem 1.1rem;
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.5;
  font-style: italic;
`;

const THOUGHTS = [
  { text: '"What if I choose the wrong stream and waste 2 years?"', accent: '#f59e0b' },
  { text: '"Everyone says engineering — but is it actually right for me?"', accent: '#ef4444' },
  { text: '"I have no idea where my interest is. I just know I\'m scared."', accent: '#8b5cf6' },
  { text: '"I feel behind. Everyone else seems to have it figured out."', accent: '#3b82f6' },
];

export default function MentorshipProblem() {
  return (
    <Section>
      <Container>
        <ImagePlaceholder>
          <PlaceholderLabel>Image Placeholder</PlaceholderLabel>
          Confused student / Overwhelmed decision visual
        </ImagePlaceholder>

        <TextBlock>
          <Label>The real problem</Label>
          <Title
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            The real problem isn't marks.
          </Title>
          <LeadText>
            Students today are surrounded by advice — coaching institutes, relatives, YouTube, rank predictors. But more information doesn't create clarity. Most students make life decisions in this mental state:
          </LeadText>

          <QuoteGrid>
            {THOUGHTS.map((q, i) => (
              <QuoteCard
                key={i}
                accent={q.accent}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {q.text}
              </QuoteCard>
            ))}
          </QuoteGrid>
        </TextBlock>
      </Container>
    </Section>
  );
}