import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    to bottom,
    #eef2ff 0%,
    #f8fafc 50%,
    #ffffff 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
`;

const Container = styled.div`
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Brand = styled.div`
  margin-bottom: 2.5rem;
  text-align: center;
`;

const Logo = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 2.1rem;
  color: #111827;
  margin-bottom: 0.4rem;
`;

const Tagline = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
`;

/* ------------------ COMPONENT ------------------ */

export default function SignupLayout({ children }) {
  return (
    <PageWrapper>
      <Container>
        <Brand>
          <Logo>Saarathi</Logo>
          <Tagline>With you. For you. Until you succeed.</Tagline>
        </Brand>

        {children}
      </Container>
    </PageWrapper>
  );
}
