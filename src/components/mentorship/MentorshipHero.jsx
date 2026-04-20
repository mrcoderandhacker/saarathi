import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Section = styled.section`
  background: white;
  padding: 6rem 1.5rem 5rem;
  padding-top: 7rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;

  @media (min-width: 900px) {
    grid-template-columns: 1.1fr 0.9fr;
  }
`;

const TextBlock = styled(motion.div)``;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 2.4rem;
  color: #111827;
  line-height: 1.2;
  margin-bottom: 1.2rem;

  @media (min-width: 768px) { font-size: 3rem; }
  @media (max-width: 640px) { font-size: 2rem; }
`;

const Subtitle = styled.p`
  font-size: 0.97rem;
  color: #4b5563;
  line-height: 1.75;
  max-width: 520px;
  margin-bottom: 2rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.75rem 1.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #1f2937;
    transform: translateY(-1px);
  }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.75rem 1.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #f9fafb; }
`;

const TrustRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.8rem;
  flex-wrap: wrap;
`;

const TrustItem = styled.div`
  font-size: 0.8rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  &::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #d1d5db;
  }
`;

const VisualBlock = styled(motion.div)``;

const ImagePlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: 1px solid #e2e8f0;
`;

const MentorImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const PlaceholderLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #cbd5e1;
`;

export default function MentorshipHero() {
  const navigate = useNavigate();

  const scrollToGold = () => {
    const el = document.getElementById("gold-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Section>
      <Container>
        <TextBlock
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Label>Saarathii Mentorship</Label>
          <Title>
            You don't need more information.
            <br />
            You need clarity.
          </Title>
          <Subtitle>
            Whether you're preparing for JEE, considering a drop year, exploring design, business, or unsure about everything — we help you understand your direction and build a structured roadmap.
          </Subtitle>

          <ButtonRow>
            <PrimaryBtn onClick={scrollToGold}>
              Get Your Mentor
            </PrimaryBtn>
            <SecondaryBtn onClick={() => navigate("/discover")}>
              Discover Your Path First
            </SecondaryBtn>
          </ButtonRow>

          <TrustRow>
            <TrustItem>No commitment to start</TrustItem>
            <TrustItem>Personally matched mentor</TrustItem>
            <TrustItem>We call within 24 hrs</TrustItem>
          </TrustRow>
        </TextBlock>

        <VisualBlock
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <ImagePlaceholder>
            <MentorImg src="/images/mentor.webp" alt="Mentorship Clarity" />
          </ImagePlaceholder>
        </VisualBlock>
      </Container>
    </Section>
  );
}