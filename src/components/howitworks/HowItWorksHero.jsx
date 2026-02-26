import { motion } from "framer-motion";
import styled from "styled-components";

/* ------------------ SECTION ------------------ */

const Section = styled.section`
  padding: 120px 24px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  align-items: center;
  gap: 60px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ------------------ LEFT ------------------ */

const Left = styled.div``;

const Title = styled.h1`
  font-size: 52px;
  font-weight: 600;
  line-height: 1.1;
  color: #111827;
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #6b7280;
  max-width: 420px;
`;

const DataRow = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 30px;
`;

const DataBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const DataNumber = styled.span`
  font-size: 22px;
  font-weight: 600;
  color: #111827;
`;

const DataLabel = styled.span`
  font-size: 13px;
  color: #9ca3af;
`;

/* ------------------ RIGHT VISUAL ------------------ */

const VisualWrapper = styled(motion.div)`
  position: relative;
  height: 520px;
`;

/* Main Roadmap Card */
const RoadmapCard = styled.div`
  position: absolute;
  width: 380px;
  height: 240px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 20px;
`;

/* Mentor Card */
const MentorCard = styled.div`
  position: absolute;
  top: 180px;
  left: 220px;
  width: 260px;
  height: 160px;
  background: #f9fafb;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.05);
  padding: 16px;
`;

/* AI Card */
const AICard = styled.div`
  position: absolute;
  top: 60px;
  left: 300px;
  width: 200px;
  height: 120px;
  background: #111827;
  border-radius: 18px;
  color: white;
  padding: 14px;
`;

/* Placeholder Image */
const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: #e5e7eb;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #9ca3af;
`;

/* ------------------ COMPONENT ------------------ */

export default function HowItWorksHero() {
  return (
    <Section>
      <Container>
        
        {/* LEFT */}
        <Left>
          <Title>
            Built as a <br /> Growth System
          </Title>

          <Subtitle>
            AI planning. Human mentorship. Structured execution.
          </Subtitle>

          <DataRow>
            <DataBlock>
              <DataNumber>30/60/90</DataNumber>
              <DataLabel>Day Plans</DataLabel>
            </DataBlock>

            <DataBlock>
              <DataNumber>1:1</DataNumber>
              <DataLabel>Mentor Assigned</DataLabel>
            </DataBlock>

            <DataBlock>
              <DataNumber>24/7</DataNumber>
              <DataLabel>AI Support</DataLabel>
            </DataBlock>
          </DataRow>
        </Left>

        {/* RIGHT */}
        <VisualWrapper
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <RoadmapCard>
            <ImagePlaceholder>
              Roadmap Preview Image
            </ImagePlaceholder>
          </RoadmapCard>

          <MentorCard>
            <ImagePlaceholder>
              Mentor Card Image
            </ImagePlaceholder>
          </MentorCard>

          <AICard>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>
              AI Insight
            </div>
            <div style={{ fontSize: "14px", marginTop: "6px" }}>
              Progress optimized.
            </div>
          </AICard>
        </VisualWrapper>

      </Container>
    </Section>
  );
}