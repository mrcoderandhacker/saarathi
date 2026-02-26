import styled from "styled-components";
import { motion } from "framer-motion";

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GoalWrapper = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.2rem;
  border-left: 4px solid #8b5cf6;
`;

const FocusLabel = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  font-weight: 600;
`;

const MainGoal = styled.h4`
  font-size: 1.1rem;
  color: #0f172a;
  margin: 0.4rem 0;
  font-weight: 600;
`;

const ProgressInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 999px;
  margin-right: 1rem;
  overflow: hidden;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6, #6366f1);
  border-radius: 999px;
  width: ${props => props.percentage}%;
`;

const ProgressText = styled.span`
  font-size: 0.85rem;
  color: #4b5563;
  font-weight: 500;
`;

export default function GoalTracker({ title = "Your Academic Goals", goal = "Crack JEE Advanced & Music Basics", progress = 35 }) {
    return (
        <Card
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <Title>
                <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" width="20" height="20">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                </svg>
                {title}
            </Title>

            <GoalWrapper>
                <FocusLabel>Primary Focus</FocusLabel>
                <MainGoal>{goal}</MainGoal>

                <ProgressInfo>
                    <ProgressBarContainer>
                        <ProgressBarFill percentage={progress} />
                    </ProgressBarContainer>
                    <ProgressText>{progress}% to milestone</ProgressText>
                </ProgressInfo>
            </GoalWrapper>
        </Card>
    );
}
