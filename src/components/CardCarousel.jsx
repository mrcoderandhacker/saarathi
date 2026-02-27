import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 360px;
`;

const PreviewCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.1rem 1.3rem;
  border: 1px solid ${p => p.border || '#e2e8f0'};
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.09);
  }
`;

const CardLabel = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.color || '#9ca3af'};
  margin-bottom: 0.35rem;
`;

const CardTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.2rem;
`;

const CardSub = styled.div`
  font-size: 0.78rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const AccentBar = styled.div`
  height: 3px;
  background: ${p => p.color};
  border-radius: 999px;
  margin-bottom: 0.7rem;
  width: ${p => p.width || '60%'};
`;

const DarkCard = styled(PreviewCard)`
  background: #0f172a;
  border-color: #0f172a;
`;

const DarkLabel = styled(CardLabel)`
  color: rgba(255,255,255,0.35);
`;

const DarkTitle = styled(CardTitle)`
  color: white;
`;

const DarkSub = styled(CardSub)`
  color: rgba(255,255,255,0.4);
`;

const CARDS = [
  {
    type: "light",
    label: "Daily Routine",
    labelColor: "#6366f1",
    title: "Build your day, your way",
    sub: "Track tasks — streak: 0 days",
    border: "#e0e7ff",
    bar: "#6366f1",
    barW: "70%",
    route: "/dashboard",
  },
  {
    type: "light",
    label: "Career Discovery",
    labelColor: "#f59e0b",
    title: "Find what fits you",
    sub: "5-question quiz — takes 2 min",
    border: "#fef3c7",
    bar: "#f59e0b",
    barW: "50%",
    route: "/discover",
  },
  {
    type: "dark",
    label: "Exam Countdown",
    title: "Set your goal date",
    sub: "JEE 2026 — set yours",
    route: "/dashboard",
  },
];

export default function CardCarousel() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(p => (p + 1) % CARDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <Wrapper>
      {CARDS.map((card, i) => {
        const isActive = i === active;
        if (!isActive) return null;

        if (card.type === "dark") {
          return (
            <AnimatePresence key={card.label} mode="wait">
              <DarkCard
                key={card.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                onClick={() => navigate(card.route)}
              >
                <DarkLabel>{card.label}</DarkLabel>
                <DarkTitle>{card.title}</DarkTitle>
                <DarkSub>{card.sub}</DarkSub>
              </DarkCard>
            </AnimatePresence>
          );
        }

        return (
          <AnimatePresence key={card.label} mode="wait">
            <PreviewCard
              key={card.label}
              border={card.border}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              onClick={() => navigate(card.route)}
            >
              <CardLabel color={card.labelColor}>{card.label}</CardLabel>
              <AccentBar color={card.bar} width={card.barW} />
              <CardTitle>{card.title}</CardTitle>
              <CardSub>{card.sub}</CardSub>
            </PreviewCard>
          </AnimatePresence>
        );
      })}

      {/* Dot indicators */}
      <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
        {CARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? "20px" : "6px",
              height: "6px",
              borderRadius: "999px",
              background: i === active ? "#111827" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </Wrapper>
  );
}