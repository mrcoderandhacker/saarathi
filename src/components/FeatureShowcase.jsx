import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Section = styled.section`
  background: white;
  padding: 5rem 1.5rem;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.7rem;
`;

const SectionTitle = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 1.9rem;
  color: #111827;
  margin-bottom: 0.5rem;
  max-width: 500px;
  line-height: 1.25;

  @media (min-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SectionSub = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 3rem;
  max-width: 520px;
  line-height: 1.65;
`;

/* Bento grid */
const BentoGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: auto auto;
  }
`;

const BentoCard = styled(motion.div)`
  background: ${p => p.dark ? '#0f172a' : p.bg || '#f8fafc'};
  border-radius: 20px;
  padding: 1.8rem;
  border: 1px solid ${p => p.dark ? 'transparent' : '#e2e8f0'};
  cursor: ${p => p.onClick ? 'pointer' : 'default'};
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
  grid-column: ${p => p.wide ? 'span 2' : 'span 1'};

  @media (max-width: 1023px) {
    grid-column: span 1;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.08);
  }
`;

const BentoImage = styled.div`
  width: 100%;
  height: ${p => p.tall ? '180px' : '140px'};
  background: ${p => p.dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border: ${p => p.hasImage ? 'none' : `2px dashed ${p.dark ? 'rgba(255,255,255,0.1)' : '#cbd5e1'}`};
  border-radius: 12px;
  margin-bottom: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${p => p.dark ? 'rgba(255,255,255,0.3)' : '#94a3b8'};
  overflow: hidden;
`;

const FeatureImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${BentoCard}:hover & {
    transform: scale(1.05);
  }
`;

const CardLabel = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${p => p.dark ? 'rgba(255,255,255,0.35)' : '#9ca3af'};
  margin-bottom: 0.6rem;
`;

const CardTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${p => p.dark ? 'white' : '#111827'};
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const CardText = styled.p`
  font-size: 0.83rem;
  color: ${p => p.dark ? 'rgba(255,255,255,0.5)' : '#6b7280'};
  line-height: 1.65;
  margin-bottom: ${p => p.hasLink ? '1rem' : '0'};
`;

const CardLink = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: ${p => p.dark ? 'rgba(255,255,255,0.6)' : '#374151'};
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-top: auto;

  &:after {
    content: '→';
    transition: transform 0.2s;
  }

  &:hover:after {
    transform: translateX(4px);
  }
`;

const PreviewStrip = styled.div`
  background: ${p => p.bg || 'rgba(99,102,241,0.08)'};
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  margin-top: 0.9rem;
  font-size: 0.78rem;
  color: ${p => p.color || '#6366f1'};
  font-weight: 500;
  font-family: 'Courier New', monospace;
  letter-spacing: -0.02em;
`;

const FEATURES = [
  {
    label: "Career Discovery",
    title: "Find what actually fits you",
    image: "/images/quiz.png",
    text: "A quick quiz mapping your strengths and interests to real career paths.",
    link: "Try the quiz",
    route: "/discover",
    bg: "#f0f0ff",
    preview: { text: "→ Problem Solver · Engineering · CS · Research", bg: "rgba(99,102,241,0.08)", color: "#4f46e5" }
  },
  {
    label: "Dashboard",
    title: "Your life, structured",
    image: "/images/dashboard.png",
    text: "Track goals, build routines, and measure your own growth — all in one place.",
    link: "See dashboard",
    route: "/dashboard",
    bg: "#f0fdf4",
    preview: { text: "Streak: 4 days · Life Score: 65/100", bg: "rgba(16,185,129,0.08)", color: "#059669" }
  },
  {
    label: "Explore Paths",
    title: "8 career streams, laid out",
    image: "/images/career-path.jpg",
    text: "Engineering to design, law to psychology — honest descriptions of each path.",
    link: "Explore paths",
    route: "/explore",
    bg: "#fffbeb",
    preview: { text: "Medicine · Law · Design · Business · and more", bg: "rgba(245,158,11,0.08)", color: "#d97706" }
  },
  {
    label: "Mentor",
    title: "A real person in your corner",
    text: "With Gold, get a matched mentor who tracks your dashboard and stays with you.",
    link: "Learn about Gold",
    route: "/mentorship",
    dark: true,
    wide: true,
    preview: null
  },
  {
    label: "Scholarships & Calendar",
    title: "The things most miss",
    text: "Government scholarships and every 2026 exam date, curated in one place.",
    link: "See scholarships",
    route: "/scholarships",
    bg: "#f5f3ff",
    preview: { text: "KVPY · INSPIRE · AICTE Pragati · and 5 more", bg: "rgba(139,92,246,0.08)", color: "#7c3aed" }
  },
];

export default function FeatureShowcase() {
  const navigate = useNavigate();

  return (
    <Section>
      <Container>
        <SectionLabel>What's inside Saarathii</SectionLabel>
        <SectionTitle
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Built around how students actually think.
        </SectionTitle>
        <SectionSub>
          Tools that help you discover yourself, plan your path, and stay consistent — whether or not you have a mentor.
        </SectionSub>

        <BentoGrid>
          {FEATURES.map((f, i) => (
            <BentoCard
              key={f.title}
              dark={f.dark}
              bg={f.bg}
              wide={f.wide}
              onClick={() => navigate(f.route)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <BentoImage dark={f.dark} tall={f.wide} hasImage={!!f.image}>
                {f.image ? (
                  <FeatureImg src={f.image} alt={f.title} />
                ) : (
                  <>📸 Feature visual placeholder</>
                )}
              </BentoImage>
              <CardLabel dark={f.dark}>{f.label}</CardLabel>
              <CardTitle dark={f.dark}>{f.title}</CardTitle>
              <CardText dark={f.dark} hasLink={!!f.link}>{f.text}</CardText>
              {f.preview && (
                <PreviewStrip bg={f.preview.bg} color={f.preview.color}>
                  {f.preview.text}
                </PreviewStrip>
              )}
              <CardLink dark={f.dark}>{f.link}</CardLink>
            </BentoCard>
          ))}
        </BentoGrid>
      </Container>
    </Section>
  );
}
