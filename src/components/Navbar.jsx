import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import logo from "../resources/logo.png";

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
  position: relative;

  &:hover {
    color: #111827;
  }
`;

const ActiveIndicator = styled.span`
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #111827;
  border-radius: 2px;
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

  @media (max-width: 899px) {
    padding: 0.4rem 1rem;
    font-size: 0.8rem;
  }
`;

/* ------------------ MOBILE MENU ------------------ */

const MenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #111827;

  @media (max-width: 899px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    color: #4b5563;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;

  @media (max-width: 899px) {
    display: block;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
    z-index: 99;
    padding: 0.5rem 0;
  }
`;

const MobileLinks = styled.ul`
  list-style: none;
  padding: 0.5rem 1.5rem;
  margin: 0;
`;

const MobileLinkItem = styled.li`
  padding: 1rem 0;
  font-size: 1rem;
  color: #4b5563;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  transition: color 0.2s ease;
  position: relative;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    color: #111827;
  }
`;

const MobileActiveIndicator = styled.span`
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #111827;
  border-radius: 3px;
`;

const MobileActions = styled.div`
  display: flex;
  gap: 0.8rem;
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
`;

const MobileLoginButton = styled.button`
  flex: 1;
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 0.7rem;
  border-radius: 999px;
  font-size: 0.9rem;
  color: #4b5563;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
    color: #111827;
  }
`;

const MobilePrimaryButton = styled.button`
  flex: 1;
  background: #111827;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    background: #1f2937;
  }
`;

/* ------------------ COMPONENT ------------------ */

export default function Navbar({ animate = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <Header
        initial={animate ? { y: -20, opacity: 0 } : undefined}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Nav>
          {/* LOGO */}
          <LogoWrapper onClick={() => handleNavigation("/")}>
            <img src={logo} alt="Saarathi Logo" style={{ width: 34, height: 34 }} />
            <LogoText>Saarathi</LogoText>
          </LogoWrapper>

          {/* DESKTOP LINKS */}
          <Links>
            <LinkItem onClick={() => handleNavigation("/")}>
              Home
              {location.pathname === "/" && <ActiveIndicator />}
            </LinkItem>

            <LinkItem onClick={() => handleNavigation("/mentorship")}>
              Mentorship
              {location.pathname === "/mentorship" && <ActiveIndicator />}
            </LinkItem>

            <LinkItem onClick={() => handleNavigation("/college-explorer")}>
              Explore Colleges
              {location.pathname === "/college-explorer" && <ActiveIndicator />}
            </LinkItem>

            <LinkItem onClick={() => handleNavigation("/how-it-works")}>
              How It Works
              {location.pathname === "/how-it-works" && <ActiveIndicator />}
            </LinkItem>

            <LinkItem onClick={() => setIsMenuOpen(false)}>
              For Students
            </LinkItem>

            <LinkItem onClick={() => setIsMenuOpen(false)}>
              Journal
            </LinkItem>
          </Links>

          {/* ACTIONS */}
          <Actions>
            {user ? (
              <PrimaryButton onClick={() => handleNavigation("/dashboard")}>
                Dashboard
              </PrimaryButton>
            ) : (
              <>
                <LoginButton onClick={() => handleNavigation("/login")}>Login</LoginButton>
                <PrimaryButton onClick={() => handleNavigation("/signup")}>
                  Get Started
                </PrimaryButton>
              </>
            )}

            <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </MenuButton>
          </Actions>
        </Nav>
      </Header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <MobileLinks>
            <MobileLinkItem onClick={() => handleNavigation("/")}>
              Home
              {location.pathname === "/" && <MobileActiveIndicator />}
            </MobileLinkItem>

            <MobileLinkItem onClick={() => handleNavigation("/mentorship")}>
              Mentorship
              {location.pathname === "/mentorship" && <MobileActiveIndicator />}
            </MobileLinkItem>

            <MobileLinkItem onClick={() => handleNavigation("/college-explorer")}>
              Explore Colleges
              {location.pathname === "/college-explorer" && <MobileActiveIndicator />}
            </MobileLinkItem>

            <MobileLinkItem onClick={() => handleNavigation("/how-it-works")}>
              How It Works
              {location.pathname === "/how-it-works" && <MobileActiveIndicator />}
            </MobileLinkItem>

            <MobileLinkItem onClick={() => setIsMenuOpen(false)}>
              For Students
            </MobileLinkItem>

            <MobileLinkItem onClick={() => setIsMenuOpen(false)}>
              Journal
            </MobileLinkItem>
          </MobileLinks>

          <MobileActions>
            {user ? (
              <MobilePrimaryButton onClick={() => handleNavigation("/dashboard")}>
                Dashboard
              </MobilePrimaryButton>
            ) : (
              <>
                <MobileLoginButton onClick={() => handleNavigation("/login")}>Login</MobileLoginButton>
                <MobilePrimaryButton onClick={() => handleNavigation("/signup")}>
                  Get Started
                </MobilePrimaryButton>
              </>
            )}
          </MobileActions>
        </MobileMenu>
      )}
    </>
  );
}