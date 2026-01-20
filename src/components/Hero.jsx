import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CardCarousel from "./CardCarousel";

/* ------------------ STYLES ------------------ */

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  background: linear-gradient(
    to bottom,
    #e8f0ff 0%,
    #f4f7ff 40%,
    #faf8f2 100%
  );
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8rem 1.5rem 6rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;

  @media (min-width: 900px) {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const TextBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Badge = styled.span`
  align-self: flex-start;
  background: #e6f4ea;
  color: #137333;
  font-size: 0.85rem;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-weight: 500;
`;

const Heading = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 2.8rem;
  line-height: 1.15;
  color: #111827;

  @media (min-width: 768px) {
    font-size: 3.6rem;
  }
`;

const Description = styled.p`
  font-size: 1.05rem;
  color: #4b5563;
  max-width: 520px;
`;

const SubDescription = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  max-width: 520px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.75rem 1.6rem;
  border-radius: 999px;
  font-size: 0.95rem;
  transition: background 0.25s ease;

  &:hover {
    background: #1f2937;
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.6rem;
  border-radius: 999px;
  font-size: 0.95rem;
  transition: background 0.25s ease;

  &:hover {
    background: #f3f4f6;
  }
`;

const VisualBlock = styled(motion.div)`
  display: flex;
  justify-content: center;
`;

/* ------------------ COMPONENT ------------------ */

export default function Hero() {
  const navigate = useNavigate();

  return (
    <HeroSection>
      <Container>
        <Grid>
          {/* LEFT TEXT */}
          <TextBlock
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge>🎓 Student Mentorship Platform</Badge>

            <Heading>
              With you. For you.
              <br />
              Until you succeed.
            </Heading>

            <Description>
              Saarathi is your personal mentor through the most confusing
              phase of your academic journey — from Class 10 to your dream
              college.
            </Description>

            <SubDescription>
              Academic clarity, emotional support, and real guidance —
              not advice, but mentorship.
            </SubDescription>

            <ButtonRow>
              <PrimaryButton onClick={() => navigate("/signup")}>
                Get Your Saarathi
              </PrimaryButton>

              <SecondaryButton>
                Explore How It Works
              </SecondaryButton>
            </ButtonRow>
          </TextBlock>

          {/* RIGHT VISUAL */}
          <VisualBlock
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <CardCarousel />
          </VisualBlock>
        </Grid>
      </Container>
    </HeroSection>
  );
}
