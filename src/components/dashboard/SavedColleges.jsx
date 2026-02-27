import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: none;
  color: #4f46e5;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CollegeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CollegeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid transparent;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: white;
    border-color: #e2e8f0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transform: translateX(4px);
  }
`;

const CollegeIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: ${props => props.color || '#e0e7ff'};
  color: ${props => props.textColor || '#4f46e5'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const CollegeDetails = styled.div`
  flex: 1;
`;

const CollegeName = styled.h4`
  font-size: 0.95rem;
  color: #0f172a;
  margin: 0 0 0.2rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
`;

const CollegeMeta = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  gap: 0.5rem;
`;

const DeleteBtn = styled.button`
  background: transparent;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #cbd5e1;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
    color: #dc2626;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  text-align: center;
  padding: 1rem;
`;

const LockIcon = styled.div`
  width: 48px;
  height: 48px;
  background: #111827;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const OverlayText = styled.h4`
  font-size: 1.1rem;
  color: #111827;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const OverlayButton = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s;

  &:hover {
    background: #1f2937;
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e0;
  text-align: center;
`;

export default function SavedColleges({ user }) {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchColleges();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saved_colleges')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setColleges(data || []);
    } catch (err) {
      console.error("Error fetching saved colleges:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCollege = async (id, e) => {
    e.stopPropagation();
    setColleges(prev => prev.filter(c => c.id !== id));
    await supabase.from('saved_colleges').delete().eq('id', id);
  };


  return (
    <Card
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Header>
        <Title>
          <svg viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" width="20" height="20">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Saved Targets
        </Title>
        <ViewAllButton onClick={() => navigate("/college-explorer")}>
          Explore more
        </ViewAllButton>
      </Header>

      <CollegeList>
        {loading ? (
          <EmptyStateContainer style={{ opacity: 0.5 }}>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Loading saved colleges...</p>
          </EmptyStateContainer>
        ) : colleges.length > 0 ? (
          colleges.map((college) => (
            <CollegeItem key={college.id}>
              <CollegeIcon color={college.icon_color} textColor={college.text_color}>
                {college.initials || "C"}
              </CollegeIcon>
              <CollegeDetails>
                <CollegeName title={college.college_name}>{college.college_name}</CollegeName>
                <CollegeMeta>
                  <span>📍 {college.city || "Unknown"}</span>
                  <span>•</span>
                  <span style={{ fontWeight: 500, color: "#111827" }}>
                    {college.focus_area || "General"}
                  </span>
                </CollegeMeta>
              </CollegeDetails>
              <DeleteBtn onClick={(e) => deleteCollege(college.id, e)} title="Remove">
                ×
              </DeleteBtn>
            </CollegeItem>
          ))
        ) : (
          <EmptyStateContainer>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              You haven't saved any colleges yet.
            </p>
            <button
              onClick={() => navigate("/college-explorer")}
              style={{
                background: "transparent",
                color: "#4f46e5",
                border: "none",
                fontWeight: 500,
                cursor: "pointer",
                padding: 0
              }}
            >
              Explore Colleges
            </button>
          </EmptyStateContainer>
        )}
      </CollegeList>

      {!user && (
        <Overlay>
          <LockIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </LockIcon>
          <OverlayText>Log in to save colleges</OverlayText>
          <OverlayButton onClick={() => navigate("/login")}>Login</OverlayButton>
        </Overlay>
      )}
    </Card>
  );
}
