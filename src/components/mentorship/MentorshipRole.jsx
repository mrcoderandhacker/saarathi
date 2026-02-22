import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Section = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem;
  background: #f9fafb;
  border-radius: 2rem;
`;

const Center = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem auto;
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2.2rem;
  color: #111827;
  margin-bottom: 1.2rem;
`;

const Subtitle = styled.p`
  color: #4b5563;
  line-height: 1.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid #e5e7eb;
`;

const CardTitle = styled.h4`
  margin-bottom: 0.8rem;
  color: #111827;
`;

const CardText = styled.p`
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
`;

/* ------------------ COMPONENT ------------------ */

export default function MentorshipRole() {
  return (
    <Section>
      <Center>
        <Title>
          Saarathi’s Role
        </Title>

        <Subtitle>
          We act as your strategic thinking partner.
          Not just exam mentors — but clarity architects.
        </Subtitle>
      </Center>

      <Grid>
        <Card>
          <CardTitle>Clarity Before Commitment</CardTitle>
          <CardText>
            We help you understand your strengths,
            personality, and long-term compatibility
            before choosing a path.
          </CardText>
        </Card>

        <Card>
          <CardTitle>Future Intelligence</CardTitle>
          <CardText>
            We analyse industries — engineering, medicine,
            business, arts, music, tech — and explain
            real scope, stability, and evolution.
          </CardText>
        </Card>

        <Card>
          <CardTitle>Structured Roadmap</CardTitle>
          <CardText>
            Once direction is clear, we build
            a step-by-step academic and skill roadmap
            tailored to you.
          </CardText>
        </Card>
      </Grid>
    </Section>
  );
}