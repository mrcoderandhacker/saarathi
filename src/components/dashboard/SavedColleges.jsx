import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
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

export default function SavedColleges() {
    const navigate = useNavigate();

    // Mock data representing shortlisted colleges
    const colleges = [
        {
            id: 1,
            name: "IIT Madras - Indian Institute of Technology",
            city: "Chennai",
            score: "89.42",
            iconColor: "#fee2e2",
            textColor: "#dc2626",
            initials: "IITM"
        },
        {
            id: 2,
            name: "National Institute of Design",
            city: "Ahmedabad",
            score: "Art/Design",
            iconColor: "#f3e8ff",
            textColor: "#9333ea",
            initials: "NID"
        },
        {
            id: 3,
            name: "Whistling Woods International",
            city: "Mumbai",
            score: "Film",
            iconColor: "#dcfce7",
            textColor: "#16a34a",
            initials: "WWI"
        }
    ];

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
                {colleges.map(college => (
                    <CollegeItem key={college.id}>
                        <CollegeIcon color={college.iconColor} textColor={college.textColor}>
                            {college.initials}
                        </CollegeIcon>
                        <CollegeDetails>
                            <CollegeName>{college.name}</CollegeName>
                            <CollegeMeta>
                                <span>📍 {college.city}</span>
                                <span>•</span>
                                <span>⭐ {college.score}</span>
                            </CollegeMeta>
                        </CollegeDetails>
                    </CollegeItem>
                ))}
            </CollegeList>
        </Card>
    );
}
