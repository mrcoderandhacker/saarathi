import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import MentorshipHero from "../components/mentorship/MentorshipHero";
import MentorshipProblem from "../components/mentorship/MentorshipProblem";
import MentorshipRole from "../components/mentorship/MentorshipRole";
import MentorshipTimeline from "../components/mentorship/MentorshipTimeline";
import SaarathiiChat from "../components/mentorship/SaarathiiChat";
import MentorshipGoldCTA from "../components/mentorship/MentorshipGoldCTA";

import styled from "styled-components";

const ChatSection = styled.section`
  background: #f5f3ff;
  padding: 4rem 1.5rem;
`;

const ChatInner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`;

const ChatLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.7rem;
  text-align: center;
`;

const ChatTitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.9rem;
  font-weight: 700;
  color: #0a0a0a;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const ChatSub = styled.p`
  font-size: 0.9rem;
  color: #4b5563;
  text-align: center;
  max-width: 560px;
  margin: 0 auto 2rem;
  line-height: 1.65;
`;

export default function Mentorship() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* 1. Hero — problem statement + CTA */}
        <MentorshipHero />

        {/* 2. The real problem — student thoughts */}
        <MentorshipProblem />

        {/* 3. Saarathii's role — dark numbered pillars */}
        <MentorshipRole />

        {/* 4. How the mentor relationship works — timeline */}
        <MentorshipTimeline />

        {/* 5. AI chat — try it now */}
        <ChatSection id="ai-chat-section">
          <ChatInner>
            <ChatLabel>Free for everyone</ChatLabel>
            <ChatTitle>Talk to Saarathii — Your AI Guide</ChatTitle>
            <ChatSub>
              Get instant guidance for your academic journey. Ask anything about stream selection, exam prep, or career paths — no login needed.
            </ChatSub>
            <SaarathiiChat />
          </ChatInner>
        </ChatSection>

        {/* 6. Gold CTA — get a real mentor */}
        <MentorshipGoldCTA />
      </main>

      <Footer />
    </>
  );
}