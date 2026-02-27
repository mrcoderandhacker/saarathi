import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Layout = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 80px;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem;
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 2.4rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
  @media (max-width: 640px) { font-size: 1.8rem; }
`;

const PageSub = styled(motion.p)`
  font-size: 0.95rem;
  color: #64748b;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PathGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const PathCard = styled(motion.div)`
  background: white;
  border-radius: 18px;
  padding: 1.4rem;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 4px;
    background: ${p => p.color};
    border-radius: 4px 4px 0 0;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  }
`;

const PathEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 0.7rem;
`;

const PathName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.3rem;
`;

const PathDesc = styled.p`
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 0.8rem;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const Tag = styled.span`
  background: ${p => p.bg || '#f1f5f9'};
  color: ${p => p.color || '#475569'};
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
`;

const DiscoverBanner = styled(motion.div)`
  background: linear-gradient(135deg, #0f172a, #1e1b4b);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const BannerText = styled.div``;
const BannerTitle = styled.h3`
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  margin-bottom: 0.4rem;
`;
const BannerSub = styled.p`
  font-size: 0.85rem;
  opacity: 0.7;
`;
const BannerBtn = styled.button`
  background: white;
  color: #1e1b4b;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  &:hover { opacity: 0.9; }
`;

const PATHS = [
    {
        emoji: "⚗️", name: "Engineering & Technology",
        desc: "Build the future with code, circuits, and systems. From JEE to IITs — one of the most structured paths in India.",
        color: "#6366f1",
        exams: ["JEE Main", "JEE Advanced", "BITSAT", "State CETs"],
        tags: [
            { label: "JEE", bg: "#ede9fe", color: "#7c3aed" },
            { label: "High demand", bg: "#dcfce7", color: "#15803d" },
            { label: "4–5 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
    {
        emoji: "🩺", name: "Medicine & Healthcare",
        desc: "Heal people. A deeply meaningful career that requires patience and a strong foundation in Biology.",
        color: "#ef4444",
        exams: ["NEET UG", "NEET PG", "AIIMS"],
        tags: [
            { label: "NEET", bg: "#fee2e2", color: "#dc2626" },
            { label: "High impact", bg: "#fef3c7", color: "#d97706" },
            { label: "5.5 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
    {
        emoji: "⚖️", name: "Law & Governance",
        desc: "Shape society through justice. Law offers paths in litigation, corporate legal, policy, and the judiciary.",
        color: "#f59e0b",
        exams: ["CLAT", "AILET", "LSAT India"],
        tags: [
            { label: "CLAT", bg: "#fffbeb", color: "#d97706" },
            { label: "Versatile", bg: "#ede9fe", color: "#7c3aed" },
            { label: "3–5 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
    {
        emoji: "📊", name: "Business & Finance",
        desc: "Build companies, manage money, and drive growth. Commerce opens doors to MBA, CA, CFA, and more.",
        color: "#10b981",
        exams: ["CAT", "CA Foundation", "CUET"],
        tags: [
            { label: "CAT/MBA", bg: "#dcfce7", color: "#15803d" },
            { label: "Lucrative", bg: "#fef3c7", color: "#d97706" },
            { label: "3–2 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
    {
        emoji: "🎨", name: "Design & Creative Arts",
        desc: "Visual communication, product design, film, and architecture — all need creative minds with structured thinking.",
        color: "#ec4899",
        exams: ["NID", "NIFT", "UCEED", "NID DAT"],
        tags: [
            { label: "NID/NIFT", bg: "#fce7f3", color: "#be185d" },
            { label: "High skill", bg: "#ede9fe", color: "#7c3aed" },
            { label: "4 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
    {
        emoji: "🧠", name: "Psychology & Social Sciences",
        desc: "Understand how people think, feel, and society works. One of the fastest growing career fields globally.",
        color: "#8b5cf6",
        exams: ["CUET", "DU Entrance", "State Entrances"],
        tags: [
            { label: "CUET", bg: "#ede9fe", color: "#7c3aed" },
            { label: "Growing fast", bg: "#dcfce7", color: "#15803d" },
            { label: "3 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
    {
        emoji: "🌿", name: "Environment & Sustainability",
        desc: "The world needs people who can solve climate challenges. Careers in environmental science, policy, and green tech.",
        color: "#22c55e",
        exams: ["IIT JAM", "CUET", "State Entrances"],
        tags: [
            { label: "Future-critical", bg: "#dcfce7", color: "#15803d" },
            { label: "Purpose-driven", bg: "#ede9fe", color: "#7c3aed" },
            { label: "4 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
    {
        emoji: "✈️", name: "Hospitality, Tourism & Sports",
        desc: "Often overlooked, these fields are professionally rich and offer global opportunities for those who love people and experiences.",
        color: "#3b82f6",
        exams: ["NCHMCT JEE", "State Sports Quotas"],
        tags: [
            { label: "Global scope", bg: "#dbeafe", color: "#1d4ed8" },
            { label: "People-focused", bg: "#fce7f3", color: "#be185d" },
            { label: "3–4 years", bg: "#f1f5f9", color: "#475569" },
        ]
    },
];

export default function ExplorePaths() {
    const navigate = useNavigate();

    return (
        <Layout>
            <Navbar />
            <Container>
                <Hero>
                    <PageTitle initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                        There's more than one right path. 🌍
                    </PageTitle>
                    <PageSub initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                        Explore 8 major career streams, what they require, and what kind of person thrives in each.
                    </PageSub>
                </Hero>

                {/* Quick discover CTA */}
                <DiscoverBanner initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <BannerText>
                        <BannerTitle>Not sure which path is yours?</BannerTitle>
                        <BannerSub>Take our 5-minute "Who Am I?" quiz — get a personalised career match.</BannerSub>
                    </BannerText>
                    <BannerBtn onClick={() => navigate("/discover")}>Take the Quiz →</BannerBtn>
                </DiscoverBanner>

                <SectionTitle>🗺️ Career Streams</SectionTitle>
                <PathGrid>
                    {PATHS.map((path, i) => (
                        <PathCard
                            key={path.name}
                            color={path.color}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <PathEmoji>{path.emoji}</PathEmoji>
                            <PathName>{path.name}</PathName>
                            <PathDesc>{path.desc}</PathDesc>
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: "0.5rem", fontWeight: 600 }}>
                                Key exams: {path.exams.join(" · ")}
                            </div>
                            <Tags>
                                {path.tags.map(t => (
                                    <Tag key={t.label} bg={t.bg} color={t.color}>{t.label}</Tag>
                                ))}
                            </Tags>
                        </PathCard>
                    ))}
                </PathGrid>
            </Container>
            <Footer />
        </Layout>
    );
}
