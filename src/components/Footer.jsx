import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const FooterSection = styled.footer`
  background: #0f172a;
  color: #e5e7eb;
  padding: 4.5rem 1.5rem 2.5rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 3.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
`;

const Brand = styled.div``;

const Logo = styled.h3`
  font-family: "Playfair Display", serif;
  font-size: 1.6rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const BrandText = styled.p`
  font-size: 0.95rem;
  color: #cbd5f5;
  line-height: 1.7;
  max-width: 320px;
`;

const Column = styled.div``;

const ColumnTitle = styled.h4`
  font-size: 0.95rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const Link = styled.p`
  font-size: 0.9rem;
  color: #cbd5f5;
  margin-bottom: 0.6rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  align-items: center;
  text-align: center;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const BottomText = styled.p`
  font-size: 0.85rem;
  color: #9ca3af;
`;

/* ------------------ COMPONENT ------------------ */

export default function Footer() {
  return (
    <FooterSection>
      <Container>
        {/* TOP */}
        <TopGrid>
          <Brand>
            <Logo>Saarathi</Logo>
            <BrandText>
              Saarathi is a student mentorship platform built to guide
              students through the most important academic decisions of
              their lives — with clarity, care, and continuous support.
            </BrandText>
          </Brand>

          <Column>
            <ColumnTitle>Platform</ColumnTitle>
            <Link>How it works</Link>
            <Link>Mentorship</Link>
            <Link>For students</Link>
            <Link>Journal</Link>
          </Column>

          <Column>
            <ColumnTitle>Support</ColumnTitle>
            <Link>Contact us</Link>
            <Link>Talk to a mentor</Link>
            <Link>FAQs</Link>
            <Link>Privacy policy</Link>
          </Column>

          <Column>
            <ColumnTitle>Connect</ColumnTitle>
            <Link>Instagram</Link>
            <Link>Email</Link>
            <Link>LinkedIn</Link>
          </Column>
        </TopGrid>

        {/* BOTTOM */}
        <BottomBar>
          <BottomText>
            © {new Date().getFullYear()} Saarathi. All rights reserved.
          </BottomText>
          <BottomText>
            With you. For you. Until you succeed.
          </BottomText>
        </BottomBar>
      </Container>
    </FooterSection>
  );
}
