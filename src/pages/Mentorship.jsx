import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import MentorshipHero from "../components/mentorship/MentorshipHero";
import MentorshipProblem from "../components/mentorship/MentorshipProblem";
import MentorshipRole from "../components/mentorship/MentorshipRole";
import SaarathiiChat from "../components/mentorship/SaarathiiChat";

import styled from "styled-components";

const AISection = styled.section`
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  background: linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%);
  border-radius: 40px 40px 0 0;
  scroll-margin-top: 80px; /* Adds offset for smooth scrolling */
`;

const AITitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2.4rem;
  font-weight: 700;
  color: #0a0a0a;
  text-align: center;
  margin-bottom: 1rem;
`;

const AISubtitle = styled.p`
  font-size: 1.1rem;
  color: #4b5563;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
`;

const Highlight = styled.span`
  color: #8b5cf6;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 0;
    width: 100%;
    height: 6px;
    background: #ede9fe;
    z-index: -1;
    border-radius: 4px;
  }
`;

// Add a floating button to access AI chat
const AIFloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.3);
  z-index: 99;
  transition: all 0.2s;

  &:hover {
    background: #7c3aed;
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(139, 92, 246, 0.4);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

// Add a section connector
const SectionConnector = styled.div`
  text-align: center;
  margin: 2rem 0;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #e0e7ff, transparent);
  }
  
  &::before {
    left: 0;
  }
  
  &::after {
    right: 0;
  }
`;

const ConnectorText = styled.span`
  background: white;
  padding: 0.5rem 1.5rem;
  color: #8b5cf6;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid #e0e7ff;
  border-radius: 40px;
  display: inline-block;
`;

export default function Mentorship() {
  // Force scroll to top when page loads
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant" // Use "instant" to prevent any scrolling animation
    });
  }, []);

  const scrollToAI = () => {
    const aiSection = document.getElementById('ai-chat-section');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Navbar />

      <main>
        <MentorshipHero />
        
        {/* Section Connector - Visual separator */}
        <SectionConnector>
          <ConnectorText>✨ Need personalized guidance?</ConnectorText>
        </SectionConnector>
        
        {/* AI Chat Section - Added after Hero with ID for scrolling */}
        <AISection id="ai-chat-section">
          <AITitle>
            Talk to <Highlight>Saarathii</Highlight> — Your AI Mentor
          </AITitle>
          <AISubtitle>
            Get instant, personalized guidance for your academic journey. 
            Ask anything about stream selection, exam prep, or career paths.
          </AISubtitle>
          <SaarathiiChat />
        </AISection>

        <MentorshipProblem />
        <MentorshipRole />
      </main>

      <Footer />
    </>
  );
}