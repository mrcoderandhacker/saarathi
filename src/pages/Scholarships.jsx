import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

const Layout = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding-top: 80px;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.2rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 0.3rem;
  @media (max-width: 640px) { font-size: 1.6rem; }
`;

const PageSub = styled(motion.p)`
  font-size: 0.9rem; color: #64748b; margin-bottom: 2rem;
`;

const Filters = styled.div`
  display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;
`;

const FilterChip = styled.button`
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid ${p => p.selected ? '#6366f1' : '#e2e8f0'};
  background: ${p => p.selected ? '#ede9fe' : 'white'};
  color: ${p => p.selected ? '#4f46e5' : '#6b7280'};
  font-size: 0.82rem;
  font-weight: ${p => p.selected ? '600' : '400'};
  cursor: pointer;
  transition: all 0.15s;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const SchCard = styled(motion.div)`
  background: white;
  border-radius: 18px;
  padding: 1.3rem;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 4px; height: 100%;
    background: ${p => CAT_COLORS[p.category] || '#6366f1'};
    border-radius: 4px 0 0 4px;
  }
`;

const SchName = styled.h3`
  font-size: 0.95rem; font-weight: 700; color: #111827; margin: 0 0 0.3rem;
`;

const SchBody = styled.p`
  font-size: 0.8rem; color: #6b7280; line-height: 1.5; margin-bottom: 0.8rem;
`;

const SchMeta = styled.div`
  display: flex; gap: 0.5rem; flex-wrap: wrap;
`;

const MetaChip = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  background: ${p => p.bg || '#f1f5f9'};
  color: ${p => p.color || '#475569'};
`;

const LinkBtn = styled.a`
  display: inline-block;
  margin-top: 0.8rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #6366f1;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const CAT_COLORS = {
    "Merit": "#6366f1",
    "SC/ST": "#10b981",
    "OBC": "#f59e0b",
    "Girls": "#ec4899",
    "Minority": "#8b5cf6",
    "Sports": "#3b82f6",
    "All": "#64748b",
};

const SCHOLARSHIPS = [
    {
        name: "Central Sector Scheme of Scholarship",
        body: "For Class 12 pass students with above 80th percentile. ₹10,000–₹20,000/year.",
        category: "Merit",
        for: "JEE, NEET, General",
        deadline: "Oct–Nov annually",
        link: "https://scholarships.gov.in",
        tags: [{ label: "Merit-based", bg: "#ede9fe", color: "#7c3aed" }, { label: "Central Govt", bg: "#dbeafe", color: "#1d4ed8" }]
    },
    {
        name: "Post-Matric Scholarship (SC/ST)",
        body: "Full fee waiver + maintenance allowance for SC/ST students in post-secondary education.",
        category: "SC/ST",
        for: "All streams",
        deadline: "Varies by state",
        link: "https://scholarships.gov.in",
        tags: [{ label: "SC/ST", bg: "#dcfce7", color: "#15803d" }, { label: "Fee waiver", bg: "#fef3c7", color: "#d97706" }]
    },
    {
        name: "Begum Hazrat Mahal National Scholarship",
        body: "For minority girls (Class 9–12 girls). ₹5,000–₹6,000/year. Run by Maulana Azad Foundation.",
        category: "Minority",
        for: "Class 9–12 Girls",
        deadline: "Sep–Nov annually",
        link: "https://maef.nic.in",
        tags: [{ label: "Minority", bg: "#f5f3ff", color: "#6d28d9" }, { label: "Girls only", bg: "#fce7f3", color: "#be185d" }]
    },
    {
        name: "AICTE Pragati Scholarship",
        body: "For girl students in technical education. ₹30,000/year + ₹2,000 contingency.",
        category: "Girls",
        for: "Engineering / Technical",
        deadline: "Dec–Jan annually",
        link: "https://www.aicte-india.org/bureaus/slac/pragati",
        tags: [{ label: "Girls only", bg: "#fce7f3", color: "#be185d" }, { label: "₹30,000/yr", bg: "#dcfce7", color: "#15803d" }]
    },
    {
        name: "KVPY Fellowship",
        body: "For students pursuing research in Basic Sciences. Monthly stipend + annual grant during BSc/MSc.",
        category: "Merit",
        for: "Science / Research",
        deadline: "Aug annually",
        link: "https://kvpy.iisc.ac.in",
        tags: [{ label: "Research", bg: "#ede9fe", color: "#7c3aed" }, { label: "Highly competitive", bg: "#fee2e2", color: "#dc2626" }]
    },
    {
        name: "Tata Scholarship for Cornell University",
        body: "Full funding for Indian students from families earning < ₹4.5 lakh/year to study at Cornell.",
        category: "Merit",
        for: "Undergraduate (International)",
        deadline: "Jan (Cornell deadline)",
        link: "https://tatascholarship.cornell.edu",
        tags: [{ label: "International", bg: "#dbeafe", color: "#1d4ed8" }, { label: "Full funding", bg: "#dcfce7", color: "#15803d" }]
    },
    {
        name: "Pradhan Mantri Scholarship Scheme",
        body: "For children of ex-servicemen and paramilitary personnel. ₹2,500–₹3,000/month.",
        category: "All",
        for: "Professional Courses",
        deadline: "Oct annually",
        link: "https://ksb.gov.in/pmss.htm",
        tags: [{ label: "Ex-servicemen", bg: "#fef3c7", color: "#d97706" }, { label: "Monthly stipend", bg: "#dcfce7", color: "#15803d" }]
    },
    {
        name: "INSPIRE Scholarship (DST)",
        body: "₹80,000/year for top 1% in Class 12 pursuing natural sciences at the undergraduate level.",
        category: "Merit",
        for: "Science (BSc level)",
        deadline: "Dec annually",
        link: "https://online-inspire.gov.in",
        tags: [{ label: "DST / Govt", bg: "#ede9fe", color: "#7c3aed" }, { label: "₹80,000/yr", bg: "#dcfce7", color: "#15803d" }]
    },
];

const CATEGORIES = ["All", "Merit", "SC/ST", "Girls", "Minority", "Sports"];

export default function Scholarships() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered = activeFilter === "All"
        ? SCHOLARSHIPS
        : SCHOLARSHIPS.filter(s => s.category === activeFilter);

    return (
        <Layout>
            <Navbar />
            <Container>
                <PageTitle initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    Scholarships for You 🎓
                </PageTitle>
                <PageSub initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                    Government and private scholarships that most students miss. Filter by what applies to you.
                </PageSub>

                <Filters>
                    {CATEGORIES.map(cat => (
                        <FilterChip key={cat} selected={activeFilter === cat} onClick={() => setActiveFilter(cat)}>
                            {cat}
                        </FilterChip>
                    ))}
                </Filters>

                <Grid>
                    {filtered.map((s, i) => (
                        <SchCard
                            key={s.name}
                            category={s.category}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                        >
                            <SchName>{s.name}</SchName>
                            <SchBody>{s.body}</SchBody>
                            <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginBottom: "0.5rem" }}>
                                📅 Deadline: {s.deadline} · 👥 For: {s.for}
                            </div>
                            <SchMeta>
                                {s.tags.map(t => (
                                    <MetaChip key={t.label} bg={t.bg} color={t.color}>{t.label}</MetaChip>
                                ))}
                            </SchMeta>
                            <LinkBtn href={s.link} target="_blank" rel="noopener noreferrer">Apply / Learn more →</LinkBtn>
                        </SchCard>
                    ))}
                </Grid>
            </Container>
            <Footer />
        </Layout>
    );
}
