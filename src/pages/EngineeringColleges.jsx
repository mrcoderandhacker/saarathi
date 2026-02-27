import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { supabase } from "../lib/supabase";

const Container = styled.div`
  min-height: 100vh;
  padding-top: 100px;
  background: #f9fafb;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  
  @media (max-width: 899px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.1rem;
  color: #4b5563;
  max-width: 700px;
  line-height: 1.6;
`;

const InfoBadge = styled(motion.div)`
  display: inline-block;
  background: #e0e7ff;
  color: #4f46e5;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 1rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  outline: none;
  
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.95rem;
  outline: none;
  background: white;
  min-width: 150px;
  
  &:focus {
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  user-select: none;

  &:hover {
    background: #f1f5f9;
  }
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.95rem;
  color: #1e293b;
  border-bottom: 1px solid #f1f5f9;
  max-width: 300px;
  white-space: normal;
  word-wrap: break-word;
`;

const Tr = styled.tr`
  &:hover {
    background: #f8fafc;
  }
  &:last-child td {
    border-bottom: none;
  }
`;

const SaveButton = styled.button`
  background: ${props => props.saved ? '#dcfce7' : 'transparent'};
  color: ${props => props.saved ? '#16a34a' : '#4f46e5'};
  border: 1px solid ${props => props.saved ? '#16a34a' : '#4f46e5'};
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.saved ? '#dcfce7' : '#e0e7ff'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const RankBadge = styled.span`
  background: #f1f5f9;
  color: #0f172a;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const LoadingState = styled.div`
  padding: 4rem;
  text-align: center;
  color: #6b7280;
  font-size: 1.1rem;
`;

const ErrorState = styled.div`
  padding: 2rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  margin-top: 1rem;
`;

export default function EngineeringColleges() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [savingId, setSavingId] = useState(null);
    const [savedIds, setSavedIds] = useState(new Set());

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("All");

    // Sorting (default: saarathii_rank asc)
    const [sortConfig, setSortConfig] = useState({ key: "saarathii_rank", direction: "asc" });

    useEffect(() => {
        checkUser();
        fetchColleges();
    }, []);

    const checkUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        // If logged in, fetch their already saved colleges
        if (user) {
            const { data } = await supabase
                .from('saved_colleges')
                .select('college_name')
                .eq('user_id', user.id);

            if (data) {
                const savedNames = new Set(data.map(c => c.college_name));
                setSavedIds(savedNames);
            }
        }
    };

    const fetchColleges = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data: colleges, error: fetchError } = await supabase
                .from('engineering_summary')
                .select('*');

            console.log("Supabase response:", { colleges, fetchError });

            if (fetchError) throw fetchError;

            setData(colleges || []);
        } catch (err) {
            console.error("Error fetching colleges:", err);
            setError(err.message || "Failed to load engineering colleges");
        } finally {
            setLoading(false);
        }
    };

    // Extract unique states for the filter dropdown
    const states = useMemo(() => {
        const uniqueStates = new Set(data.map(item => item.state).filter(Boolean));
        return ["All", ...Array.from(uniqueStates).sort()];
    }, [data]);

    // Handle sort request
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (key === 'avg_tlr' || key === 'avg_rpc' || key === 'saarathii_score') {
            // Default to high-to-low for score metrics if it's a new sort key
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filter and sort the data
    const processedData = useMemo(() => {
        let filteredData = [...data];

        // Search filter
        if (searchQuery) {
            filteredData = filteredData.filter(item =>
                item.institute_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // State filter
        if (selectedState !== "All") {
            filteredData = filteredData.filter(item => item.state === selectedState);
        }

        // Sort
        if (sortConfig.key) {
            filteredData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue == null && bValue == null) return 0;
                if (aValue == null) return sortConfig.direction === 'asc' ? 1 : -1;
                if (bValue == null) return sortConfig.direction === 'asc' ? -1 : 1;

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredData;
    }, [data, searchQuery, selectedState, sortConfig]);

    const getSortIndicator = (columnName) => {
        if (sortConfig.key === columnName) {
            return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
        }
        return '';
    };

    const handleSaveCollege = async (college) => {
        if (!user) {
            alert("Please log in to save colleges to your dashboard!");
            return;
        }

        try {
            setSavingId(college.institute_id);

            // Ensure profile row exists (FK: saved_colleges.user_id → profiles.id)
            await supabase
                .from('profiles')
                .upsert({ id: user.id }, { onConflict: 'id' });

            const { error } = await supabase
                .from('saved_colleges')
                .insert({
                    user_id: user.id,
                    college_name: college.institute_name,
                    city: college.city,
                    focus_area: `Engineering (Score: ${college.saarathii_score?.toFixed(1) || 'N/A'})`,
                    icon_color: '#fee2e2',
                    text_color: '#dc2626',
                    initials: college.institute_name.substring(0, 2).toUpperCase()
                });

            if (error) throw error;

            setSavedIds(prev => {
                const newSet = new Set(prev);
                newSet.add(college.institute_name);
                return newSet;
            });

        } catch (e) {
            console.error("Failed to save college", e);
            alert("Failed to save college. Please try again.");
        } finally {
            setSavingId(null);
        }
    };

    // Construct structured data (JSON-LD) for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Table",
        "name": "Top Engineering Colleges in India",
        "description": "Comprehensive ranking of top engineering institutes in India based on Saarathii parameters including TLR and RPC.",
        "about": {
            "@type": "EducationalOrganization",
            "name": "Engineering Colleges in India"
        }
    };

    return (
        <Container>
            <Helmet>
                <title>Top Engineering Colleges in India 2026 Rankings | Saarathii</title>
                <meta name="description" content="Discover the best engineering colleges in India for 2026. Compare TLR, RPC, and overall Saarathii scores based on 10 years of historical data to find your perfect fit." />
                <meta name="keywords" content="top engineering colleges in india, best btech colleges, engineering rankings 2026, IIT rankings, NIT rankings, saarathii rankings" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="Top Engineering Colleges in India 2026 Rankings | Saarathii" />
                <meta property="og:description" content="Discover the best engineering colleges in India based on 10 years of data. Compare TLR, RPC, and overall Saarathii scores." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.saarathii.com/college-explorer/engineering" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Top Engineering Colleges in India 2026" />
                <meta name="twitter:description" content="Compare the top engineering institutes in India with our comprehensive ranking system." />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            <Content>
                <HeaderSection>
                    <Title
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Top Engineering Colleges in India
                    </Title>
                    <Subtitle
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Explore the most comprehensive ranking of engineering institutes based on extensive parameters including TLR (Teaching, Learning & Resources) and RPC (Research & Professional Practice).
                    </Subtitle>
                    <InfoBadge
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        ✨ Database is created by taking account of 10 years of historical data
                    </InfoBadge>
                </HeaderSection>

                {error && <ErrorState>{error}</ErrorState>}

                <ControlsContainer>
                    <Input
                        type="text"
                        placeholder="Search by institute name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                    >
                        {states.map(state => (
                            <option key={state} value={state}>{state === "All" ? "All States" : state}</option>
                        ))}
                    </Select>
                </ControlsContainer>

                {loading ? (
                    <LoadingState>Loading college data...</LoadingState>
                ) : (
                    <TableContainer>
                        <Table>
                            <thead>
                                <tr>
                                    <Th onClick={() => requestSort('saarathii_rank')}>
                                        Rank{getSortIndicator('saarathii_rank')}
                                    </Th>
                                    <Th onClick={() => requestSort('institute_name')}>
                                        Institute Name{getSortIndicator('institute_name')}
                                    </Th>
                                    <Th onClick={() => requestSort('city')}>
                                        City{getSortIndicator('city')}
                                    </Th>
                                    <Th onClick={() => requestSort('state')}>
                                        State{getSortIndicator('state')}
                                    </Th>
                                    <Th onClick={() => requestSort('saarathii_score')}>
                                        Saarathii Score{getSortIndicator('saarathii_score')}
                                    </Th>
                                    <Th onClick={() => requestSort('avg_tlr')}>
                                        Avg TLR{getSortIndicator('avg_tlr')}
                                    </Th>
                                    <Th onClick={() => requestSort('avg_rpc')}>
                                        Avg RPC{getSortIndicator('avg_rpc')}
                                    </Th>
                                    <Th>Action</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedData.length > 0 ? (
                                    processedData.map((college) => (
                                        <Tr key={college.institute_id}>
                                            <Td>
                                                <RankBadge>#{college.saarathii_rank}</RankBadge>
                                            </Td>
                                            <Td style={{ fontWeight: 500 }}>{college.institute_name}</Td>
                                            <Td>{college.city}</Td>
                                            <Td>{college.state}</Td>
                                            <Td>{college.saarathii_score?.toFixed(2) || 'N/A'}</Td>
                                            <Td>{college.avg_tlr?.toFixed(2) || 'N/A'}</Td>
                                            <Td>{college.avg_rpc?.toFixed(2) || 'N/A'}</Td>
                                            <Td>
                                                <SaveButton
                                                    onClick={() => handleSaveCollege(college)}
                                                    disabled={savingId === college.institute_id || savedIds.has(college.institute_name)}
                                                    saved={savedIds.has(college.institute_name)}
                                                >
                                                    {savingId === college.institute_id
                                                        ? "Saving..."
                                                        : savedIds.has(college.institute_name)
                                                            ? "Saved"
                                                            : "Save"
                                                    }
                                                </SaveButton>
                                            </Td>
                                        </Tr>
                                    ))
                                ) : (
                                    <Tr>
                                        <Td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No colleges found matching your criteria.
                                        </Td>
                                    </Tr>
                                )}
                            </tbody>
                        </Table>
                    </TableContainer>
                )}
            </Content>
        </Container>
    );
}
