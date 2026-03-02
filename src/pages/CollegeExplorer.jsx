import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Award, BookmarkPlus, BookmarkCheck, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

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
  margin-bottom: 3rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

// --- NEW SEARCH & DATABASE STYLES --- //

const DatabaseSection = styled.div`
  margin-top: 4rem;
  padding-top: 3rem;
  border-top: 1px solid #e2e8f0;
`;

const LayoutSplit = styled.div`
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  flex-wrap: wrap;

  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  flex: 0 0 280px;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  position: sticky;
  top: 100px;
  
  @media (max-width: 992px) {
    flex: 1 1 100%;
    width: 100%;
    position: static;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.2s;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
    outline: none;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 0.5rem;
  cursor: pointer;
  
  input {
    accent-color: #6366f1;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

const ResultsArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const DetailedCollegeCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 1.2rem;
  transition: all 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    transform: translateY(-2px);
  }
`;

const SaveBtn = styled(motion.button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${p => p.saved ? '#ec4899' : 'rgba(241, 245, 249, 0.8)'};
  color: ${p => p.saved ? 'white' : '#64748b'};
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(4px);
  
  &:hover {
    background: ${p => p.saved ? '#db2777' : '#e2e8f0'};
    color: ${p => p.saved ? 'white' : '#0f172a'};
  }
`;

const CTagsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const CTag = styled.span`
  background: ${p => p.bg || '#f1f5f9'};
  color: ${p => p.color || '#475569'};
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.02em;
`;

const CTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.4rem;
  line-height: 1.3;
  padding-right: 2rem;
`;

const CLocation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 1.2rem;
`;

const CMetaContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
  margin-top: auto;
  padding-top: 1.2rem;
  border-top: 1px dashed #e2e8f0;
`;

const CMetaBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const CMetaLabel = styled.span`
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  margin-bottom: 0.2rem;
`;

const CMetaValue = styled.span`
  font-size: 0.9rem;
  color: #0f172a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  
  h3 { color: #0f172a; margin-top: 1rem; margin-bottom: 0.5rem; }
`;

// --- MOCK DATABASE ENTRIES --- //
const MOCK_DB = [
  {
    id: "c1",
    name: "IIT Bombay - Indian Institute of Technology",
    location: "Mumbai, Maharashtra",
    stream: "Engineering",
    type: "Government",
    nirf: 3,
    exam: "JEE Advanced",
    acceptance: "1.2%"
  },
  {
    id: "c2",
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    stream: "Engineering",
    type: "Private",
    nirf: 25,
    exam: "BITSAT",
    acceptance: "4.5%"
  },
  {
    id: "c3",
    name: "AIIMS Delhi",
    location: "New Delhi",
    stream: "Medical",
    type: "Government",
    nirf: 1,
    exam: "NEET UG",
    acceptance: "0.1%"
  },
  {
    id: "c4",
    name: "National Law School of India University (NLSIU)",
    location: "Bengaluru, Karnataka",
    stream: "Law",
    type: "Government",
    nirf: 1,
    exam: "CLAT",
    acceptance: "2%"
  },
  {
    id: "c5",
    name: "National Institute of Design (NID)",
    location: "Ahmedabad, Gujarat",
    stream: "Design",
    type: "Government",
    nirf: 1, // Custom
    exam: "NID DAT",
    acceptance: "1.5%"
  },
  {
    id: "c6",
    name: "IIM Ahmedabad",
    location: "Ahmedabad, Gujarat",
    stream: "Business",
    type: "Government",
    nirf: 1,
    exam: "CAT",
    acceptance: "1%"
  },
  {
    id: "c7",
    name: "Vellore Institute of Technology (VIT)",
    location: "Vellore, Tamil Nadu",
    stream: "Engineering",
    type: "Private",
    nirf: 11,
    exam: "VITEEE",
    acceptance: "25%"
  },
  {
    id: "c8",
    name: "Christian Medical College (CMC)",
    location: "Vellore, Tamil Nadu",
    stream: "Medical",
    type: "Private",
    nirf: 3,
    exam: "NEET UG",
    acceptance: "4%"
  }
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [savedIds, setSavedIds] = useState(new Set());
  const [saving, setSaving] = useState(false);

  // Note: We don't block render on auth check here, we just use it for the Save button.
  // In a real prod environment, we would fetch saved colleges on load.
  const handleCardClick = (cat) => {
    if (cat.route) navigate(cat.route);
  };

  const handleSaveToggle = async (id, name) => {
    if (saving) return;
    setSaving(true);

    // Optimistic UI
    const nextSaved = new Set(savedIds);
    const isSaved = nextSaved.has(id);

    if (isSaved) nextSaved.delete(id);
    else nextSaved.add(id);
    setSavedIds(nextSaved);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert("Please log in to save colleges.");
        // Revert optimistic on fail
        const rev = new Set(nextSaved);
        if (isSaved) rev.add(id); else rev.delete(id);
        setSavedIds(rev);
        setSaving(false);
        return;
      }

      if (isSaved) {
        // Delete logic (assuming name is unique for this mock setup)
        await supabase.from("saved_colleges")
          .delete()
          .eq("user_id", session.user.id)
          .eq("name", name);
      } else {
        // Insert logic
        await supabase.from("saved_colleges")
          .insert({ user_id: session.user.id, name: name });
      }
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real colleges from the new Node/Express backend
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        setLoading(true);
        // Build query string based on filters
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedStream !== 'All') params.append('stream', selectedStream);
        if (selectedType !== 'All') params.append('type', selectedType);

        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const res = await fetch(`${baseUrl}/api/colleges?${params.toString()}`);
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        setColleges(data);
      } catch (e) {
        console.error("Failed to fetch colleges:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [searchQuery, selectedStream, selectedType]);

  const filteredColleges = colleges;

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

        <DatabaseSection>
          <SectionTitle>The Live Directory</SectionTitle>
          <SectionSub>Filter and search across India's top colleges in real-time.</SectionSub>

          <LayoutSplit>
            <Sidebar>
              <SearchContainer>
                <SearchIconWrapper><Search size={18} /></SearchIconWrapper>
                <SearchInput
                  type="text"
                  placeholder="Search IITs, NITs, AIIMS..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </SearchContainer>

              <FilterGroup>
                <FilterTitle><Filter size={16} /> Stream</FilterTitle>
                {["All", "Engineering", "Medical", "Law", "Design", "Business"].map(stream => (
                  <FilterLabel key={stream}>
                    <input
                      type="radio"
                      name="stream"
                      checked={selectedStream === stream}
                      onChange={() => setSelectedStream(stream)}
                    />
                    {stream}
                  </FilterLabel>
                ))}
              </FilterGroup>

              <FilterGroup>
                <FilterTitle><Filter size={16} /> Type</FilterTitle>
                {["All", "Government", "Private"].map(type => (
                  <FilterLabel key={type}>
                    <input
                      type="radio"
                      name="type"
                      checked={selectedType === type}
                      onChange={() => setSelectedType(type)}
                    />
                    {type}
                  </FilterLabel>
                ))}
              </FilterGroup>
            </Sidebar>

            <ResultsArea>
              {loading ? (
                <EmptyResults>
                  <h3>Loading Colleges...</h3>
                  <p>Fetching real data from the Saarathii database.</p>
                </EmptyResults>
              ) : filteredColleges.length === 0 ? (
                <EmptyResults>
                  <h3>No matches found</h3>
                  <p>Try adjusting your search or filters.</p>
                </EmptyResults>
              ) : (
                <ResultsGrid>
                  {filteredColleges.map((college, i) => {
                    const isSaved = savedIds.has(college.id);
                    return (
                      <DetailedCollegeCard
                        key={college.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <SaveBtn
                          saved={isSaved ? 1 : 0}
                          onClick={() => handleSaveToggle(college.id, college.name)}
                        >
                          {isSaved ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                        </SaveBtn>
                        <CTagsContainer>
                          <CTag>{college.type}</CTag>
                          <CTag bg="#f0fdf4" color="#166534">{college.stream}</CTag>
                        </CTagsContainer>
                        <CTitle>{college.name}</CTitle>
                        <CLocation><MapPin size={14} /> {college.location}, {college.state}</CLocation>

                        <CMetaContainer>
                          <CMetaBlock>
                            <CMetaLabel>Rank</CMetaLabel>
                            <CMetaValue>
                              <Award size={14} color="#f59e0b" />
                              {college.nirf_rank ? `NIRF ${college.nirf_rank}` : 'N/A'}
                            </CMetaValue>
                          </CMetaBlock>
                          <CMetaBlock>
                            <CMetaLabel>Exam</CMetaLabel>
                            <CMetaValue>{college.exam_accepted || 'Varies'}</CMetaValue>
                          </CMetaBlock>
                        </CMetaContainer>
                      </DetailedCollegeCard>
                    );
                  })}
                </ResultsGrid>
              )}
            </ResultsArea>
          </LayoutSplit>
        </DatabaseSection>
      </Container>

      <Footer />
    </Layout >
  );
}
