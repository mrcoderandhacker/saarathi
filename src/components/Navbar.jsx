import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import logo from "../resources/logo.png";

/* ------------------ STYLES ------------------ */

const Header = styled(motion.header)`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2000;
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

/* Drawer backdrop */
const Backdrop = styled(motion.div)`
  display: none;

  @media (max-width: 899px) {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
    z-index: 1999;
  }
`;

/* Slide-in Drawer */
const MobileMenu = styled(motion.div)`
  display: none;

  @media (max-width: 899px) {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(320px, 85vw);
    background: white;
    z-index: 2001;
    box-shadow: -10px 0 40px rgba(0,0,0,0.12);
    overflow-y: auto;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
`;

const DrawerLogo = styled.div`
  font-family: "Playfair Display", serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
`;

const CloseBtn = styled.button`
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #374151;
  &:hover { background: #e2e8f0; }
`;

const DrawerLinks = styled.div`
  flex: 1;
  padding: 0.8rem 0;
`;

const DrawerLink = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.85rem 1.5rem;
  font-size: 0.95rem;
  color: ${p => p.active ? '#6366f1' : '#374151'};
  font-weight: ${p => p.active ? '600' : '400'};
  background: ${p => p.active ? '#f0f0ff' : 'transparent'};
  cursor: pointer;
  border-left: 3px solid ${p => p.active ? '#6366f1' : 'transparent'};
  transition: all 0.15s;

  &:hover {
    background: #f8fafc;
    color: #111827;
  }
`;

const DrawerDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 0.5rem 0;
`;

const DrawerActions = styled.div`
  padding: 1rem 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-top: 1px solid #f1f5f9;
`;

const MobileLoginButton = styled.button`
  width: 100%;
  background: transparent;
  border: 1px solid #e5e7eb;
  padding: 0.7rem;
  border-radius: 999px;
  font-size: 0.9rem;
  color: #4b5563;
  cursor: pointer;
  &:hover { background: #f9fafb; color: #111827; }
`;

const MobilePrimaryButton = styled.button`
  width: 100%;
  background: #111827;
  color: white;
  border: none;
  padding: 0.7rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  &:hover { background: #1f2937; }
`;

/* ------------------ ACCOUNT DROPDOWN ------------------ */

const AccountWrapper = styled.div`
  position: relative;
`;

const AvatarButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  border: 2px solid transparent;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  outline: none;

  &:hover {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background: white;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  min-width: 220px;
  overflow: hidden;
  z-index: 200;
`;

const DropdownHeader = styled.div`
  padding: 1rem 1.2rem 0.8rem;
  border-bottom: 1px solid #f1f5f9;
`;

const DropdownEmail = styled.div`
  font-size: 0.78rem;
  color: #6b7280;
  margin-top: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DropdownName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
`;

const DropdownList = styled.ul`
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
`;

const DropdownItem = styled.li`
  padding: 0.7rem 1.2rem;
  font-size: 0.9rem;
  color: ${props => props.danger ? '#dc2626' : '#374151'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  transition: background 0.15s;

  &:hover {
    background: ${props => props.danger ? '#fef2f2' : '#f8fafc'};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #f1f5f9;
  margin: 0.3rem 0;
`;

/* ------------------ COMPONENT ------------------ */

export default function Navbar({ animate = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const accountRef = useRef(null);
  const exploreRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setAccountOpen(false);
    setExploreOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAccountOpen(false);
    navigate("/");
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

            {/* Explore Dropdown */}
            <LinkItem
              style={{ position: 'relative' }}
              onClick={() => setExploreOpen(o => !o)}
              ref={exploreRef}
            >
              Explore ▾
              {['/discover', '/explore', '/scholarships', '/calendar'].some(p => location.pathname === p) && <ActiveIndicator />}
              <AnimatePresence>
                {exploreOpen && (
                  <DropdownMenu
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    style={{ minWidth: '200px', top: '130%', left: 0 }}
                  >
                    <DropdownList>
                      <DropdownItem onClick={() => handleNavigation('/discover')}>
                        🧠 Discover Yourself
                      </DropdownItem>
                      <DropdownItem onClick={() => handleNavigation('/explore')}>
                        🌍 Explore Career Paths
                      </DropdownItem>
                      <DropdownItem onClick={() => handleNavigation('/scholarships')}>
                        🎓 Scholarships
                      </DropdownItem>
                      <DropdownItem onClick={() => handleNavigation('/calendar')}>
                        📅 Exam Calendar
                      </DropdownItem>
                    </DropdownList>
                  </DropdownMenu>
                )}
              </AnimatePresence>
            </LinkItem>

            <LinkItem onClick={() => handleNavigation("/journal")}>
              Journal
              {location.pathname === "/journal" && <ActiveIndicator />}
            </LinkItem>

            <LinkItem onClick={() => handleNavigation("/dashboard")}>
              Dashboard
              {location.pathname === "/dashboard" && <ActiveIndicator />}
            </LinkItem>
          </Links>

          {/* ACTIONS */}
          <Actions>
            {user ? (
              <AccountWrapper ref={accountRef}>
                <AvatarButton onClick={() => setAccountOpen(!accountOpen)} title="Account">
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </AvatarButton>

                <AnimatePresence>
                  {accountOpen && (
                    <DropdownMenu
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                    >
                      <DropdownHeader>
                        <DropdownName>My Account</DropdownName>
                        <DropdownEmail>{user.email}</DropdownEmail>
                      </DropdownHeader>

                      <DropdownList>
                        <DropdownItem onClick={() => handleNavigation("/dashboard")}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                          </svg>
                          Dashboard
                        </DropdownItem>

                        <DropdownItem onClick={() => handleNavigation("/profile")}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                          </svg>
                          My Profile
                        </DropdownItem>

                        <DropdownItem onClick={() => handleNavigation("/college-explorer")}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                          Saved Colleges
                        </DropdownItem>

                        <DropdownItem onClick={() => handleNavigation("/mentorship")}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          My Mentor
                        </DropdownItem>

                        <DropdownDivider />

                        <DropdownItem danger onClick={handleLogout}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                          Log Out
                        </DropdownItem>
                      </DropdownList>
                    </DropdownMenu>
                  )}
                </AnimatePresence>
              </AccountWrapper>
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

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <Backdrop
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <MobileMenu
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Drawer header */}
              <DrawerHeader>
                <DrawerLogo>Saarathii</DrawerLogo>
                <CloseBtn onClick={() => setIsMenuOpen(false)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </CloseBtn>
              </DrawerHeader>

              {/* Nav links */}
              <DrawerLinks>
                <DrawerLink active={location.pathname === "/"} onClick={() => handleNavigation("/")}>
                  Home
                </DrawerLink>
                <DrawerLink active={location.pathname === "/mentorship"} onClick={() => handleNavigation("/mentorship")}>
                  Mentorship
                </DrawerLink>
                <DrawerLink active={location.pathname.startsWith("/college-explorer")} onClick={() => handleNavigation("/college-explorer")}>
                  College Explorer
                </DrawerLink>
                <DrawerLink active={location.pathname === "/how-it-works"} onClick={() => handleNavigation("/how-it-works")}>
                  How It Works
                </DrawerLink>
                <DrawerLink active={location.pathname === "/dashboard"} onClick={() => handleNavigation("/dashboard")}>
                  Dashboard
                </DrawerLink>
                <DrawerLink active={location.pathname === "/journal"} onClick={() => handleNavigation("/journal")}>
                  Journal
                </DrawerLink>

                <DrawerDivider />

                <DrawerLink active={location.pathname === "/discover"} onClick={() => handleNavigation("/discover")}>
                  Discover Yourself
                </DrawerLink>
                <DrawerLink active={location.pathname === "/explore"} onClick={() => handleNavigation("/explore")}>
                  Career Paths
                </DrawerLink>
                <DrawerLink active={location.pathname === "/scholarships"} onClick={() => handleNavigation("/scholarships")}>
                  Scholarships
                </DrawerLink>
                <DrawerLink active={location.pathname === "/calendar"} onClick={() => handleNavigation("/calendar")}>
                  Exam Calendar
                </DrawerLink>
                <DrawerLink active={location.pathname === "/about"} onClick={() => handleNavigation("/about")}>
                  About
                </DrawerLink>

                {user && (
                  <>
                    <DrawerDivider />
                    <DrawerLink active={location.pathname === "/profile"} onClick={() => handleNavigation("/profile")}>
                      My Profile
                    </DrawerLink>
                  </>
                )}
              </DrawerLinks>

              {/* Bottom actions */}
              <DrawerActions>
                {user ? (
                  <MobileLoginButton
                    onClick={handleLogout}
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                  >
                    Log Out
                  </MobileLoginButton>
                ) : (
                  <>
                    <MobileLoginButton onClick={() => handleNavigation("/login")}>Login</MobileLoginButton>
                    <MobilePrimaryButton onClick={() => handleNavigation("/signup")}>
                      Get Started
                    </MobilePrimaryButton>
                  </>
                )}
              </DrawerActions>
            </MobileMenu>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
