import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

/* ---- STYLES ---- */
const Layout = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  padding-top: 80px;
`;

const Container = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem;
`;

const ProgressBar = styled.div`
  height: 3px;
  background: rgba(255,255,255,0.1);
  border-radius: 999px;
  margin-bottom: 3rem;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a78bfa);
  border-radius: 999px;
`;

const QuestionNum = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.8rem;
`;

const Question = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: white;
  margin-bottom: 0.5rem;
  line-height: 1.3;

  @media (max-width: 640px) { font-size: 1.4rem; }
`;

const QuestionSub = styled(motion.p)`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.5);
  margin-bottom: 2rem;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OptionBtn = styled(motion.button)`
  background: ${p => p.selected ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.06)'};
  border: 1.5px solid ${p => p.selected ? '#6366f1' : 'rgba(255,255,255,0.12)'};
  border-radius: 14px;
  padding: 1rem 1.2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;
  color: white;

  &:hover { background: rgba(99,102,241,0.2); border-color: rgba(99,102,241,0.5); }
`;

const OptionEmoji = styled.div`
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
`;

const OptionLabel = styled.div`
  font-size: 0.88rem;
  font-weight: 600;
  line-height: 1.3;
`;

const OptionDesc = styled.div`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.45);
  margin-top: 0.2rem;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const BackBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.6);
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-size: 0.88rem;
  cursor: pointer;
  &:hover { border-color: rgba(255,255,255,0.4); color: white; }
`;

const NextBtn = styled.button`
  background: ${p => p.disabled ? 'rgba(255,255,255,0.1)' : 'white'};
  color: ${p => p.disabled ? 'rgba(255,255,255,0.3)' : '#111827'};
  border: none;
  padding: 0.6rem 1.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
`;

/* Results */
const ResultCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.2rem;
`;

const ResultHeader = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const ResultEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 0.8rem;
`;

const ResultType = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: #111827;
  margin-bottom: 0.4rem;
`;

const ResultTagline = styled.p`
  font-size: 0.92rem;
  color: #6b7280;
  line-height: 1.5;
`;

const SectionTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  margin-bottom: 0.7rem;
`;

const CareerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  margin-bottom: 1.2rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const CareerChip = styled.div`
  background: ${p => p.bg || '#ede9fe'};
  color: ${p => p.color || '#6d28d9'};
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TraitRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const Trait = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.3rem 0.8rem;
  font-size: 0.78rem;
  color: #374151;
`;

const RetakeBtn = styled.button`
  width: 100%;
  background: #111827;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  &:hover { background: #1f2937; }
`;

/* ---- DATA ---- */
const QUESTIONS = [
    {
        id: "energy",
        q: "What gives you energy?",
        sub: "Think about your best days.",
        options: [
            { emoji: "🤝", label: "Helping people", desc: "Guiding, supporting, teaching others", value: "social" },
            { emoji: "🔬", label: "Solving problems", desc: "Analysing, researching, experimenting", value: "analytical" },
            { emoji: "🎨", label: "Creating things", desc: "Design, art, building from scratch", value: "creative" },
            { emoji: "📈", label: "Leading & organising", desc: "Managing projects, making decisions", value: "leader" },
        ]
    },
    {
        id: "subject",
        q: "Which subject feels most natural?",
        sub: "Not what you're forced to study.",
        options: [
            { emoji: "🧪", label: "Science & Maths", desc: "Numbers, logic, experiments", value: "stem" },
            { emoji: "📜", label: "History & Society", desc: "People, culture, events, politics", value: "humanities" },
            { emoji: "🎭", label: "Arts & Languages", desc: "Literature, music, visual arts", value: "arts" },
            { emoji: "💰", label: "Economics & Business", desc: "Markets, money, how things work", value: "commerce" },
        ]
    },
    {
        id: "work",
        q: "What kind of work appeals to you?",
        sub: "Ignore salary for a second.",
        options: [
            { emoji: "🏥", label: "Healing & caring", desc: "Medicine, psychology, therapy", value: "care" },
            { emoji: "💻", label: "Building with tech", desc: "Software, AI, engineering", value: "tech" },
            { emoji: "🌍", label: "Changing the world", desc: "Policy, education, environment", value: "impact" },
            { emoji: "🎬", label: "Expressing & entertaining", desc: "Film, media, design, writing", value: "expression" },
        ]
    },
    {
        id: "environment",
        q: "Where do you see yourself?",
        sub: "Your ideal work life.",
        options: [
            { emoji: "🏢", label: "Corporate environment", desc: "Structure, teams, stability", value: "corporate" },
            { emoji: "🚀", label: "Startups & innovation", desc: "Fast-paced, build-your-own", value: "startup" },
            { emoji: "🎓", label: "Research or academia", desc: "Deep learning, discovery", value: "research" },
            { emoji: "🌿", label: "Independent / freelance", desc: "Flexibility, own terms", value: "freelance" },
        ]
    },
    {
        id: "values",
        q: "What matters most to you?",
        sub: "Your core driver.",
        options: [
            { emoji: "💸", label: "Financial freedom", desc: "Build wealth, live well", value: "money" },
            { emoji: "❤️", label: "Making an impact", desc: "Leave the world better", value: "impact" },
            { emoji: "🧠", label: "Continuous learning", desc: "Always growing, never bored", value: "growth" },
            { emoji: "🕊️", label: "Work-life balance", desc: "Time for family and passions", value: "balance" },
        ]
    }
];

/* ---- Career profiles by answer pattern ---- */
const getResult = (answers) => {
    const vals = Object.values(answers);
    const score = (v) => vals.filter(x => x === v).length;

    if (score("stem") >= 2 || score("analytical") >= 2) {
        return {
            type: "The Problem Solver",
            emoji: "🔬",
            tagline: "You're wired to think in systems and find elegant solutions. You get genuine satisfaction from cracking hard problems others give up on.",
            careers: [
                { emoji: "⚕️", label: "Medicine (MBBS)", bg: "#fef3c7", color: "#d97706" },
                { emoji: "⚙️", label: "Engineering (B.Tech)", bg: "#ede9fe", color: "#7c3aed" },
                { emoji: "💻", label: "Computer Science", bg: "#dbeafe", color: "#1d4ed8" },
                { emoji: "🧬", label: "Research Science", bg: "#dcfce7", color: "#15803d" },
                { emoji: "📊", label: "Data Science/AI", bg: "#f5f3ff", color: "#6d28d9" },
                { emoji: "🏗️", label: "Architecture", bg: "#fce7f3", color: "#be185d" },
            ],
            traits: ["Analytical", "Detail-oriented", "Curious", "Systematic", "Patient"]
        };
    }

    if (score("social") >= 2 || score("care") >= 2) {
        return {
            type: "The Helper & Healer",
            emoji: "🤝",
            tagline: "People gravitate toward you. You listen well, empathise deeply, and you're at your best when you're making someone else's life better.",
            careers: [
                { emoji: "🧠", label: "Psychology", bg: "#fce7f3", color: "#be185d" },
                { emoji: "⚕️", label: "Medicine (MBBS)", bg: "#fef3c7", color: "#d97706" },
                { emoji: "📚", label: "Education / Teaching", bg: "#dcfce7", color: "#15803d" },
                { emoji: "🌍", label: "Social Work / NGO", bg: "#ede9fe", color: "#7c3aed" },
                { emoji: "⚖️", label: "Law (LLB)", bg: "#dbeafe", color: "#1d4ed8" },
                { emoji: "💆", label: "Counselling / Therapy", bg: "#fff7ed", color: "#c2410c" },
            ],
            traits: ["Empathetic", "Patient", "Communicator", "Team player", "Purpose-driven"]
        };
    }

    if (score("creative") >= 2 || score("arts") >= 2 || score("expression") >= 2) {
        return {
            type: "The Creative & Visionary",
            emoji: "🎨",
            tagline: "You see things differently. Ideas and aesthetics move you. You want to build something the world hasn't seen yet.",
            careers: [
                { emoji: "🎨", label: "UI/UX Design", bg: "#fce7f3", color: "#be185d" },
                { emoji: "🎬", label: "Film & Media", bg: "#fef3c7", color: "#d97706" },
                { emoji: "✍️", label: "Writing & Journalism", bg: "#dbeafe", color: "#1d4ed8" },
                { emoji: "🏛️", label: "Architecture", bg: "#dcfce7", color: "#15803d" },
                { emoji: "📣", label: "Marketing & Advertising", bg: "#ede9fe", color: "#7c3aed" },
                { emoji: "🎭", label: "Performing Arts", bg: "#fff7ed", color: "#c2410c" },
            ],
            traits: ["Imaginative", "Original", "Expressive", "Intuitive", "Passionate"]
        };
    }

    if (score("leader") >= 2 || score("commerce") >= 2) {
        return {
            type: "The Builder & Leader",
            emoji: "📈",
            tagline: "You think big. You're drawn to building things — companies, teams, ideas. You're comfortable with risk and love the game of strategy.",
            careers: [
                { emoji: "🚀", label: "Entrepreneurship", bg: "#fef3c7", color: "#d97706" },
                { emoji: "📊", label: "Finance & Banking", bg: "#dbeafe", color: "#1d4ed8" },
                { emoji: "🏢", label: "Business Management", bg: "#dcfce7", color: "#15803d" },
                { emoji: "⚖️", label: "Law (LLB)", bg: "#ede9fe", color: "#7c3aed" },
                { emoji: "📣", label: "Marketing & Sales", bg: "#fce7f3", color: "#be185d" },
                { emoji: "🤝", label: "Consulting", bg: "#fff7ed", color: "#c2410c" },
            ],
            traits: ["Strategic", "Decisive", "Ambitious", "Resilient", "Persuasive"]
        };
    }

    // Default
    return {
        type: "The All-Rounder",
        emoji: "⭐",
        tagline: "You have a wide range of interests and your strength is adaptability. You thrive in environments that need versatile thinking.",
        careers: [
            { emoji: "💻", label: "Product Management", bg: "#ede9fe", color: "#7c3aed" },
            { emoji: "📊", label: "Data Science", bg: "#dbeafe", color: "#1d4ed8" },
            { emoji: "📣", label: "Marketing", bg: "#fce7f3", color: "#be185d" },
            { emoji: "⚖️", label: "Law", bg: "#dcfce7", color: "#15803d" },
            { emoji: "🎨", label: "Design Thinking", bg: "#fef3c7", color: "#d97706" },
            { emoji: "🌍", label: "International Relations", bg: "#fff7ed", color: "#c2410c" },
        ],
        traits: ["Adaptable", "Curious", "Collaborative", "Open-minded", "Versatile"]
    };
};

export default function Discover() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);

    const current = QUESTIONS[step];
    const progress = ((step) / QUESTIONS.length) * 100;
    const selectedValue = answers[current?.id];

    const handleSelect = (value) => {
        setAnswers(prev => ({ ...prev, [current.id]: value }));
    };

    const handleNext = () => {
        if (step < QUESTIONS.length - 1) {
            setStep(s => s + 1);
        } else {
            setResult(getResult(answers));
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(s => s - 1);
    };

    if (result) {
        return (
            <Layout>
                <Navbar />
                <Container>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <ResultCard>
                            <ResultHeader>
                                <ResultEmoji>{result.emoji}</ResultEmoji>
                                <ResultType>{result.type}</ResultType>
                                <ResultTagline>{result.tagline}</ResultTagline>
                            </ResultHeader>

                            <SectionTitle>Your traits</SectionTitle>
                            <TraitRow>
                                {result.traits.map(t => <Trait key={t}>{t}</Trait>)}
                            </TraitRow>

                            <SectionTitle>Career paths that match you</SectionTitle>
                            <CareerGrid>
                                {result.careers.map(c => (
                                    <CareerChip key={c.label} bg={c.bg} color={c.color}>
                                        <span>{c.emoji}</span>
                                        <span>{c.label}</span>
                                    </CareerChip>
                                ))}
                            </CareerGrid>

                            <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", marginBottom: "1rem" }}>
                                <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "#9ca3af", marginBottom: "0.4rem" }}>💡 Next step</div>
                                <div style={{ fontSize: "0.85rem", color: "#374151", lineHeight: "1.5" }}>
                                    Explore these paths in detail on the <strong>Explore Paths</strong> page. A Saarathii mentor can also help you build a personalized roadmap for the career that excites you most.
                                </div>
                            </div>

                            <RetakeBtn onClick={() => { setStep(0); setAnswers({}); setResult(null); }}>
                                Retake Quiz
                            </RetakeBtn>
                            <button
                                style={{ width: "100%", background: "transparent", border: "none", color: "#9ca3af", fontSize: "0.85rem", cursor: "pointer", marginTop: "0.5rem", padding: "0.5rem" }}
                                onClick={() => navigate("/explore")}
                            >
                                Explore Career Paths →
                            </button>
                        </ResultCard>
                    </motion.div>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Navbar />
            <Container>
                <ProgressBar>
                    <ProgressFill animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
                </ProgressBar>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.25 }}
                    >
                        <QuestionNum>Question {step + 1} of {QUESTIONS.length}</QuestionNum>
                        <Question>{current.q}</Question>
                        <QuestionSub>{current.sub}</QuestionSub>

                        <OptionsGrid>
                            {current.options.map(opt => (
                                <OptionBtn
                                    key={opt.value}
                                    selected={selectedValue === opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <OptionEmoji>{opt.emoji}</OptionEmoji>
                                    <OptionLabel>{opt.label}</OptionLabel>
                                    <OptionDesc>{opt.desc}</OptionDesc>
                                </OptionBtn>
                            ))}
                        </OptionsGrid>

                        <NavRow>
                            <BackBtn onClick={handleBack} style={{ visibility: step === 0 ? "hidden" : "visible" }}>
                                ← Back
                            </BackBtn>
                            <NextBtn
                                disabled={!selectedValue}
                                onClick={handleNext}
                            >
                                {step === QUESTIONS.length - 1 ? "See My Results →" : "Next →"}
                            </NextBtn>
                        </NavRow>
                    </motion.div>
                </AnimatePresence>
            </Container>
        </Layout>
    );
}
