import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 80px;
`;

const Hero = styled.div`
  background: #0f172a;
  padding: 3.5rem 1.5rem 4rem;
`;

const HeroInner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.8rem;
`;

const HeroTitle = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 2.2rem;
  color: white;
  line-height: 1.2;
  margin-bottom: 0.7rem;
  max-width: 600px;

  @media (min-width: 768px) { font-size: 2.8rem; }
`;

const HeroSub = styled.p`
  font-size: 0.92rem;
  color: rgba(255,255,255,0.5);
  max-width: 540px;
  line-height: 1.65;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
`;

const CategoryCard = styled(motion.div)`
  background: white;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 3px;
    background: ${p => p.accent};
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.08);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 160px;
  background: ${p => p.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardImagePlaceholder = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${p => p.color};
  text-align: center;
  padding: 1rem;
`;

const CardBody = styled.div`
  padding: 1.2rem;
`;

const CardTag = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${p => p.color};
  margin-bottom: 0.4rem;
`;

const CardTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.35rem;
  line-height: 1.3;
`;

const CardDesc = styled.p`
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.5;
`;

const SectionTitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.5rem;
  color: #111827;
  margin-bottom: 0.3rem;
`;

const SectionSub = styled.p`
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 1.5rem;
`;

const ComingSoonBanner = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 14px;
  padding: 1.2rem 1.5rem;
  font-size: 0.85rem;
  color: #92400e;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const CATEGORIES = [
  {
    tag: "Engineering",
    title: "Top Engineering Colleges in India",
    desc: "Explore the best engineering institutes ranked by NIRF, factoring in TLR, Research, and Placement scores.",
    accent: "#6366f1",
    color: "#4f46e5",
    bg: "#ede9fe20",
    photoColor: "#a78bfa",
    route: "/college-explorer/engineering",
  },
  {
    tag: "Medical",
    title: "Top Medical Colleges in India",
    desc: "AIIMS, government, and private medical colleges — ranked by NIRF and sorted by NEET cutoffs.",
    accent: "#ef4444",
    color: "#dc2626",
    bg: "#fee2e220",
    photoColor: "#f87171",
    route: null,
    comingSoon: true,
  },
  {
    tag: "Law",
    title: "Top Law Colleges in India",
    desc: "NLUs, private law schools, and deemed universities — ranked by CLAT rankings and placements.",
    accent: "#f59e0b",
    color: "#d97706",
    bg: "#fef3c720",
    photoColor: "#fbbf24",
    route: null,
    comingSoon: true,
  },
  {
    tag: "Design",
    title: "Top Design Colleges in India",
    desc: "NID, NIFT, and private design institutes for product design, fashion, communication, and more.",
    accent: "#ec4899",
    color: "#be185d",
    bg: "#fce7f320",
    photoColor: "#f472b6",
    route: null,
    comingSoon: true,
  },
  {
    tag: "Business",
    title: "Top Management Colleges in India",
    desc: "IIMs, top B-schools, and MBA programs — sorted by CAT cutoffs, placement data, and rankings.",
    accent: "#10b981",
    color: "#059669",
    bg: "#d1fae520",
    photoColor: "#34d399",
    route: null,
    comingSoon: true,
  },
  {
    tag: "Arts & Science",
    title: "Top Liberal Arts & Science Colleges",
    desc: "DU, JNU, top autonomous colleges for BSc, BA, and integrated programs across India.",
    accent: "#8b5cf6",
    color: "#7c3aed",
    bg: "#f5f3ff20",
    photoColor: "#a78bfa",
    route: null,
    comingSoon: true,
  },
];

export default function CollegeExplorer() {
  const navigate = useNavigate();

  const handleCardClick = (cat) => {
    if (cat.route) navigate(cat.route);
  };

  return (
    <Layout>
      <Navbar />

      <Hero>
        <HeroInner>
          <Label>College Explorer</Label>
          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Find colleges that actually fit you.
          </HeroTitle>
          <HeroSub>
            Explore ranked college lists across every major stream — engineering, medicine, law, design, and more. Sorted, filtered, and honest.
          </HeroSub>
        </HeroInner>
      </Hero>

      <Container>
        <ComingSoonBanner>
          Engineering colleges are live. Medical, Law, Design, and Business college lists are coming soon.
        </ComingSoonBanner>

        <SectionTitle>Browse by Stream</SectionTitle>
        <SectionSub>Click any category to explore colleges in that stream.</SectionSub>

        <CategoryGrid>
          {CATEGORIES.map((cat, i) => (
            <CategoryCard
              key={cat.title}
              accent={cat.accent}
              onClick={() => handleCardClick(cat)}
              style={{ cursor: cat.route ? "pointer" : "default", opacity: cat.comingSoon ? 0.75 : 1 }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: cat.comingSoon ? 0.75 : 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <CardImage bg={cat.bg}>
                <CardImagePlaceholder color={cat.photoColor}>
                  {cat.comingSoon ? "Coming Soon" : "Image Placeholder"}
                  <br />{cat.tag} colleges visual
                </CardImagePlaceholder>
              </CardImage>
              <CardBody>
                <CardTag color={cat.color}>{cat.tag}{cat.comingSoon ? " · Coming Soon" : ""}</CardTag>
                <CardTitle>{cat.title}</CardTitle>
                <CardDesc>{cat.desc}</CardDesc>
              </CardBody>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Container>

      <Footer />
    </Layout>
  );
}
