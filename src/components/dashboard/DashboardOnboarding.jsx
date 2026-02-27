import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(6px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Modal = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 520px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

const ProgressDots = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Dot = styled.div`
  width: ${p => p.active ? '24px' : '8px'};
  height: 8px;
  border-radius: 999px;
  background: ${p => p.active ? '#6366f1' : '#e2e8f0'};
  transition: all 0.3s ease;
`;

const Slide = styled(motion.div)`
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 3.5rem;
  margin-bottom: 1.2rem;
`;

const SlideTitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: #0f172a;
  margin-bottom: 0.8rem;
  font-weight: 700;
`;

const SlideText = styled.p`
  font-size: 1rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 0.5rem;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.2rem 0 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  font-size: 0.95rem;
  color: #374151;

  span:first-child {
    font-size: 1.2rem;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 2rem;
  justify-content: flex-end;
`;

const BackBtn = styled.button`
  background: transparent;
  border: 1px solid #e2e8f0;
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  font-size: 0.9rem;
  color: #64748b;
  cursor: pointer;
  &:hover { background: #f8fafc; }
`;

const NextBtn = styled.button`
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.7rem 2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #4f46e5; }
`;

const GradientAccent = styled.div`
  position: absolute;
  top: -60px;
  right: -60px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
  pointer-events: none;
`;

const SLIDES = [
    {
        emoji: "🗺️",
        title: "Your Life, Planned Simply",
        body: "Saarathi isn't just a dashboard — it's your personal command centre. We help you figure out your future, one day at a time.",
        features: [
            { icon: "🎯", text: "Set big long-term goals with milestones to break them down" },
            { icon: "📅", text: "Build a daily routine and check off tasks each day" },
            { icon: "⚖️", text: "Track academic, passion, and rest time to stay balanced" },
        ]
    },
    {
        emoji: "🏆",
        title: "Earn Your Life Score",
        body: "Every task you complete earns you points. Your Life Score grows as you stick to your routine — like a game, but for real life.",
        features: [
            { icon: "✅", text: "Check off daily tasks to gain XP and points" },
            { icon: "📈", text: "See weekly progress graphs to spot your patterns" },
            { icon: "🔥", text: "Build streaks and watch your consistency score rise" },
        ]
    },
    {
        emoji: "🌱",
        title: "Let's Get Started",
        body: "Your dashboard is ready and waiting. Start by setting one big goal — then build daily habits around it. Small steps, big life.",
        features: [
            { icon: "1️⃣", text: "Set a long-term goal (e.g. Crack JEE, Learn Guitar)" },
            { icon: "2️⃣", text: "Add your daily tasks to build a routine" },
            { icon: "3️⃣", text: "Log your interests so your life balance is personalised" },
        ]
    }
];

export default function DashboardOnboarding({ userId, onDone }) {
    const [step, setStep] = useState(0);
    const [leaving, setLeaving] = useState(false);

    const handleNext = async () => {
        if (step < SLIDES.length - 1) {
            setStep(s => s + 1);
        } else {
            await finish();
        }
    };

    const finish = async () => {
        setLeaving(true);
        // Upsert profile to mark onboarding done
        await supabase
            .from("profiles")
            .upsert({ id: userId, onboarding_done: true }, { onConflict: "id" });
        onDone();
    };

    const slide = SLIDES[step];

    return (
        <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Modal
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <GradientAccent />

                <ProgressDots>
                    {SLIDES.map((_, i) => <Dot key={i} active={i === step} />)}
                </ProgressDots>

                <AnimatePresence mode="wait">
                    <Slide
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Emoji>{slide.emoji}</Emoji>
                        <SlideTitle>{slide.title}</SlideTitle>
                        <SlideText>{slide.body}</SlideText>

                        <FeatureList>
                            {slide.features.map((f, i) => (
                                <FeatureItem key={i}>
                                    <span>{f.icon}</span>
                                    <span>{f.text}</span>
                                </FeatureItem>
                            ))}
                        </FeatureList>
                    </Slide>
                </AnimatePresence>

                <ButtonRow>
                    {step > 0 && (
                        <BackBtn onClick={() => setStep(s => s - 1)}>Back</BackBtn>
                    )}
                    <NextBtn onClick={handleNext}>
                        {step < SLIDES.length - 1 ? "Next →" : "Let's Go 🚀"}
                    </NextBtn>
                </ButtonRow>
            </Modal>
        </Backdrop>
    );
}
