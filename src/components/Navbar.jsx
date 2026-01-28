import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import logo from "../resources/logo.png"; // ✅ IMPORTANT (relative import)

/* ------------------ STYLES ------------------ */

const Header = styled(motion.header)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const LogoText = styled.span`
  font-family: "Playfair Display", serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #111827;
`;

const Links = styled.ul`
  display: none;
  list-style: none;
  gap: 2rem;
  font-size: 0.9rem;
  color: #4b5563;

  @media (min-width: 900px) {
    display: flex;
  }
`;

const LinkItem = styled.li`
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #111827;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LoginButton = styled.button`
  background: transparent;
  border: none;
  font-size: 0.9rem;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    color: #111827;
  }

  @media (max-width: 899px) {
    display: none;
  }
`;

const PrimaryButton = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.55rem 1.4rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.25s ease;

  &:hover {
    background: #1f2937;
  }
`;

/* ------------------ COMPONENT ------------------ */

export default function Navbar({ animate = true }) {
  const navigate = useNavigate();

  return (
    <Header
      initial={animate ? { y: -20, opacity: 0 } : undefined}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Nav>
        {/* LOGO + TEXT (linked with splash) */}
        <LogoWrapper onClick={() => navigate("/")}>
          <motion.img
            src={logo}
            alt="Saarathi Logo"
            layoutId="saarathi-logo"
            style={{ width: 34, height: 34 }}
          />

          <motion.span layoutId="saarathi-text">
            <LogoText>Saarathi</LogoText>
          </motion.span>
        </LogoWrapper>

        {/* CENTER LINKS */}
        <Links>
          <LinkItem>Mentorship</LinkItem>
          <LinkItem>How It Works</LinkItem>
          <LinkItem>For Students</LinkItem>
          <LinkItem>Journal</LinkItem>
        </Links>

        {/* ACTIONS */}
        <Actions>
          <LoginButton>Login</LoginButton>
          <PrimaryButton onClick={() => navigate("/signup")}>
            Get Started
          </PrimaryButton>
        </Actions>
      </Nav>
    </Header>
  );
}
