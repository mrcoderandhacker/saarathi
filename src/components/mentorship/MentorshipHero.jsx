import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Section = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 8rem 1.5rem 5rem 1.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 3rem;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  line-height: 1.7;
  max-width: 680px;
  margin: 0 auto 2.5rem auto;
`;

const CTAButton = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.9rem 2rem;
  border-radius: 999px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #1f2937;
  }
`;

const ImageWrapper = styled.div`
  margin-top: 4rem;
  display: flex;
  justify-content: center;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  max-width: 700px;
  height: 380px;
  background: #f3f4f6;
  border-radius: 1.5rem;
  border: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #9ca3af;
  font-size: 0.95rem;
`;

/* ------------------ COMPONENT ------------------ */

export default function MentorshipHero() {
  return (
    <Section>
      <Title>
        You don’t need more information.
        <br />
        You need clarity.
      </Title>

      <Subtitle>
        Whether you're preparing for JEE, considering a drop year,
        exploring design, music, business, or unsure about everything —
        we help you understand your direction and build a structured roadmap.
      </Subtitle>

      <CTAButton>
        Start My Direction Plan
      </CTAButton>

      <ImageWrapper>
        <ImagePlaceholder>
          Image: Direction / Structured Roadmap Visual
        </ImagePlaceholder>
      </ImageWrapper>
    </Section>
  );
}