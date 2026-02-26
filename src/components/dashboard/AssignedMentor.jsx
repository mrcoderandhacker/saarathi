import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
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

const EmptyStateContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e0;
`;

const Illustration = styled.div`
  width: 64px;
  height: 64px;
  background: #e0e7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: #4f46e5;
`;

const EmptyTitle = styled.h4`
  font-size: 1.05rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const EmptyText = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
`;

const MentorInfo = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e2e8f0;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const Details = styled.div`
  flex: 1;
`;

const Name = styled.h4`
  font-size: 1.1rem;
  color: #0f172a;
  margin: 0 0 0.2rem 0;
`;

const Badges = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background: ${props => props.academic ? '#dbeafe' : '#fce7f3'};
  color: ${props => props.academic ? '#1e40af' : '#9d174d'};
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.6rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #111827;
    color: white;
    &:hover { background: #1f2937; }
  ` : `
    background: #f1f5f9;
    color: #475569;
    &:hover { background: #e2e8f0; }
  `}
`;

export default function AssignedMentor() {
    const [mentor, setMentor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignedMentor();
    }, []);

    const fetchAssignedMentor = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            // Query the mentor_assignments table joined with mentors table
            const { data, error } = await supabase
                .from('mentor_assignments')
                .select(`
          id,
          status,
          mentors (
            id,
            full_name,
            expertise_academic,
            expertise_passion,
            avatar_url
          )
        `)
                .eq('student_id', user.id)
                .eq('status', 'active')
                .single();

            if (data && data.mentors) {
                setMentor(data.mentors);
            }
        } catch (err) {
            console.log("No mentor assigned yet or tables not created.", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            <Header>
                <Title>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" width="20" height="20">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Your Human Partner
                </Title>
            </Header>

            {loading ? (
                <EmptyStateContainer style={{ opacity: 0.5 }}>
                    <EmptyText>Loading mentor data...</EmptyText>
                </EmptyStateContainer>
            ) : mentor ? (
                <>
                    <MentorInfo>
                        <Avatar src={mentor.avatar_url || "https://ui-avatars.com/api/?name=" + mentor.full_name} />
                        <Details>
                            <Name>{mentor.full_name}</Name>
                            <Badges>
                                {mentor.expertise_academic?.map(exp => (
                                    <Badge key={exp} academic>{exp}</Badge>
                                ))}
                                {mentor.expertise_passion?.map(exp => (
                                    <Badge key={exp}>{exp}</Badge>
                                ))}
                            </Badges>
                        </Details>
                    </MentorInfo>
                    <ActionRow>
                        <Button primary>Message</Button>
                        <Button>Book Session</Button>
                    </ActionRow>
                </>
            ) : (
                <EmptyStateContainer>
                    <Illustration>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="32" height="32">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                    </Illustration>
                    <EmptyTitle>Matching in progress</EmptyTitle>
                    <EmptyText>
                        Our team is currently reviewing your goals to find the absolute perfect mentor for both your studies and passions!
                    </EmptyText>
                </EmptyStateContainer>
            )}
        </Card>
    );
}
