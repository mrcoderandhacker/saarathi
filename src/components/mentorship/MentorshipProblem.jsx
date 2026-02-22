import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  color: #111827;
`;

const Text = styled.p`
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 1rem;
`;

const Highlight = styled.span`
  color: #111827;
  font-weight: 500;
`;

const ImageBox = styled.div`
  height: 360px;
  background: #f3f4f6;
  border-radius: 1.5rem;
  border: 1px solid #e5e7eb;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #9ca3af;
  font-size: 0.9rem;
`;

/* ------------------ COMPONENT ------------------ */

export default function MentorshipProblem() {
  return (
    <Section>
      <Grid>
        <div>
          <Title>
            The Real Problem Isn’t Marks.
          </Title>

          <Text>
            Students today are surrounded by advice —
            coaching institutes, relatives, YouTube videos,
            rank predictions, AI tools.
          </Text>

          <Text>
            But more information does not create clarity.
          </Text>

          <Text>
            The real struggle is:
          </Text>

          <Text>
            • <Highlight>Fear of choosing wrong</Highlight><br />
            • <Highlight>Not knowing long-term future scope</Highlight><br />
            • <Highlight>Pressure from comparison</Highlight><br />
            • <Highlight>Confusion between passion and practicality</Highlight>
          </Text>

          <Text>
            And most students make life decisions in this mental state.
          </Text>
        </div>

        <ImageBox>
          Image: Confused student / Overwhelmed decision visual
        </ImageBox>
      </Grid>
    </Section>
  );
}