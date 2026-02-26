import styled from "styled-components";
import howItWorks from "../../resources/howitworksmain.png";

/* ---------------- SECTION ---------------- */

const Section = styled.section`
  padding: 40px 16px;
  background: #ffffff;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  display: flex;
  justify-content: center;
`;

const MainImage = styled.img`
  width: 100%;
  max-width: 650px;   /* 👈 control desktop size */
  height: auto;
  border-radius: 24px;
  object-fit: contain;

  @media (max-width: 768px) {
    max-width: 100%;  /* full width on mobile */
  }
`;
/* ---------------- COMPONENT ---------------- */

export default function StepsSection() {
  return (
    <Section>
      <Container>
        <MainImage src={howItWorks} alt="" />
      </Container>
    </Section>
  );
}