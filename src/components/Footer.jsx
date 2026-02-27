import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const FooterSection = styled.footer`
  background: #0f172a;
  color: #e5e7eb;
  padding: 4rem 1.5rem 2rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-bottom: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: 1.8fr 1fr 1fr 1fr;
  }
`;

const Brand = styled.div``;

const Logo = styled.h3`
  font-family: "Playfair Display", serif;
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 0.8rem;
`;

const BrandText = styled.p`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.7;
  max-width: 280px;
`;

const Column = styled.div``;

const ColumnTitle = styled.h4`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 1rem;
`;

const NavLink = styled.p`
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  margin-bottom: 0.55rem;
  cursor: pointer;
  transition: color 0.15s;

  &:hover { color: #ffffff; }
`;

const BottomBar = styled.div`
  border-top: 1px solid rgba(255,255,255,0.07);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
  text-align: center;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const BottomText = styled.p`
  font-size: 0.78rem;
  color: rgba(255,255,255,0.3);
`;

export default function Footer() {
  const navigate = useNavigate();

  return (
    <FooterSection>
      <Container>
        <TopGrid>
          <Brand>
            <Logo>Saarathii</Logo>
            <BrandText>
              A student mentorship platform built to guide students through the most important academic decisions of their lives — with clarity, care, and continuous support.
            </BrandText>
          </Brand>

          <Column>
            <ColumnTitle>Platform</ColumnTitle>
            <NavLink onClick={() => navigate("/")}>Home</NavLink>
            <NavLink onClick={() => navigate("/mentorship")}>Mentorship</NavLink>
            <NavLink onClick={() => navigate("/how-it-works")}>How It Works</NavLink>
            <NavLink onClick={() => navigate("/college-explorer")}>College Explorer</NavLink>
            <NavLink onClick={() => navigate("/dashboard")}>Dashboard</NavLink>
            <NavLink onClick={() => navigate("/about")}>About</NavLink>
          </Column>

          <Column>
            <ColumnTitle>Explore</ColumnTitle>
            <NavLink onClick={() => navigate("/discover")}>Discover Yourself</NavLink>
            <NavLink onClick={() => navigate("/explore")}>Career Paths</NavLink>
            <NavLink onClick={() => navigate("/scholarships")}>Scholarships</NavLink>
            <NavLink onClick={() => navigate("/calendar")}>Exam Calendar</NavLink>
            <NavLink onClick={() => navigate("/journal")}>Journal</NavLink>
          </Column>

          <Column>
            <ColumnTitle>Connect</ColumnTitle>
            <NavLink as="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</NavLink>
            <NavLink as="a" href="mailto:hello@saarathii.com">Email us</NavLink>
            <NavLink as="a" href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</NavLink>
            <NavLink onClick={() => navigate("/mentorship#gold-section")}>Get a Mentor</NavLink>
          </Column>
        </TopGrid>

        <BottomBar>
          <BottomText>© {new Date().getFullYear()} Saarathii. All rights reserved.</BottomText>
          <BottomText>With you. For you. Until you succeed.</BottomText>
        </BottomBar>
      </Container>
    </FooterSection>
  );
}
