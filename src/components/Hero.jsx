import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CardCarousel from "./CardCarousel";
import mainHeroBg from "../resources/mainherobg.png"; // adjust path if needed

/* ------------------ STYLES ------------------ */

const HeroSection = styled.section`
  position: relative;
  overflow: hidden;

  background: 
    linear-gradient(
      to bottom,
      rgba(232, 240, 255, 0.5) 0%,
      rgba(244, 247, 255, 0.5) 40%,
      rgba(250, 248, 242, 0.5) 100%
    ),
    url(${mainHeroBg});

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 5.5rem 1.5rem 4rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;

  @media (min-width: 900px) {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const TextBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Heading = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 2.2rem;
  line-height: 1.15;
  color: #111827;

  @media (min-width: 768px) {
    font-size: 2.9rem;
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
  background: #ee5a15;
  color: white;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    background: #1f2937;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.25s ease;

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
            <Heading>
              With you. For you.
              <br />
              Until you succeed.
            </Heading>

            <Description>
              Saarathii is your personal mentor through the most confusing
              phase of your academic journey — from Class 10 to your dream
              college.
            </Description>

            <SubDescription>
              Academic clarity, emotional support, and real guidance —
              not advice, but mentorship.
            </SubDescription>

            <ButtonRow>
              <PrimaryButton onClick={() => navigate("/signup")}>
                Get Your Saarathii
              </PrimaryButton>

              <SecondaryButton onClick={() => navigate("/how-it-works")}>
                How It Works
              </SecondaryButton>
            </ButtonRow>
          </TextBlock>

          {/* RIGHT VISUAL */}
          <VisualBlock
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
              delay: 0.2,
            }}
          >
            <CardCarousel />
          </VisualBlock>
        </Grid>
      </Container>
    </HeroSection>
  );
}