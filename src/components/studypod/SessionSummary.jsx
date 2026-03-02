import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const confetti = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
`;

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const Card = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${p => p.accent}, ${p => p.accent}88);
  }
`;

const Trophy = styled.div`
  font-size: 4rem;
  margin-bottom: 0.5rem;
  animation: ${confetti} 1s ease-out forwards;
  animation-delay: 0.3s;
  animation-fill-mode: backwards;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.4rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 2rem;
  strong { color: ${p => p.accent}; font-weight: 700; }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`;

const ScoreBox = styled(motion.div)`
  background: ${p => p.accent}22;
  border-radius: 14px;
  padding: 1.5rem 0.5rem;
  border: 1px solid ${p => p.accent}44;
  margin-bottom: 1.5rem;
  
  .score-val { font-size: 2.5rem; font-weight: 800; color: ${p => p.accent}; line-height: 1; text-shadow: 0 0 20px ${p => p.accent}66; }
  .score-lbl { font-size: 0.75rem; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.5rem; font-weight: 700;}
`;

const StatBox = styled.div`
  background: rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 1rem 0.5rem;
  border: 1px solid rgba(255,255,255,0.06);
  
  .stat-val { font-size: 1.5rem; font-weight: 800; color: white; line-height: 1; }
  .stat-lbl { font-size: 0.65rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 0.3rem; }
`;

const GoalBox = styled.div`
  background: rgba(255,255,255,0.04);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  margin-bottom: 1.5rem;
  text-align: left;

  .gb-label { font-size: 0.65rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.3rem; }
  .gb-text { font-size: 0.85rem; color: rgba(255,255,255,0.75); line-height: 1.4; font-style: italic; }
`;

const AIPill = styled.div`
  background: rgba(99,102,241,0.12);
  border: 1px solid rgba(99,102,241,0.25);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.65);
  margin-bottom: 1.5rem;
  text-align: left;
  line-height: 1.5;

  span { color: #a78bfa; font-weight: 600; }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Btn = styled(motion.button)`
  flex: 1;
  padding: 0.85rem;
  border-radius: 12px;
  border: none;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  background: ${p => p.primary ? `linear-gradient(135deg, ${p.accent}, ${p.accent}cc)` : 'rgba(255,255,255,0.07)'};
  color: white;
  transition: all 0.2s;
  &:hover { filter: brightness(1.1); }
`;

const AI_TIPS = [
  "Great session! Consider reviewing your weakest topics next time.",
  "Consistency is key. Same time tomorrow?",
  "After a strong focus session, a 20-min walk boosts retention by 20%.",
  "You're building a great habit. Keep it up!",
  "Try teaching what you just studied to someone — it's the best revision!",
];

// Simple counting animation hook
function useCountUp(end, duration = 1000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
}

export default function SessionSummary({ session, accent, onNewSession, onClose }) {
  if (!session) return null;

  const { goal, tasksCompleted, tasks, pomodoroCount, elapsedDisplay, elapsedSeconds } = session;
  const focusMins = Math.round((elapsedSeconds || 0) / 60);

  // XP Calculation: 10 XP per minute + 50 XP per completed task + 100 XP per pomodoro
  const targetScore = (focusMins * 10) + (tasksCompleted * 50) + (pomodoroCount * 100);
  const animatedScore = useCountUp(targetScore, 1200);

  const tip = AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)];

  return (
    <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => e.target === e.currentTarget && onClose?.()}>
      <Card
        accent={accent}
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <Trophy>🏆</Trophy>
        <Title>Session Complete!</Title>
        <Subtitle accent={accent}>You earned <strong>+{animatedScore} XP</strong> for this session!</Subtitle>

        <ScoreBox accent={accent} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="score-val">{animatedScore}</div>
          <div className="score-lbl">Study Score</div>
        </ScoreBox>

        <StatsGrid>
          <StatBox accent={accent}>
            <div className="stat-val">{elapsedDisplay}</div>
            <div className="stat-lbl">Focus Time</div>
          </StatBox>
          <StatBox accent={accent}>
            <div className="stat-val">{tasksCompleted}/{tasks?.length || 0}</div>
            <div className="stat-lbl">Tasks Done</div>
          </StatBox>
        </StatsGrid>

        {goal && (
          <GoalBox>
            <div className="gb-label">📍 Session Goal</div>
            <div className="gb-text">"{goal}"</div>
          </GoalBox>
        )}

        <AIPill>
          <span>✨ Saarathii Tip</span><br />{tip}
        </AIPill>

        <BtnRow>
          <Btn onClick={onClose} whileTap={{ scale: 0.97 }}>Exit Pod</Btn>
          <Btn primary accent={accent} onClick={onNewSession} whileTap={{ scale: 0.97 }}>
            🔁 New Session
          </Btn>
        </BtnRow>
      </Card>
    </Backdrop>
  );
}
