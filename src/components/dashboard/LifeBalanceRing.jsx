import styled from "styled-components";
import { motion } from "framer-motion";

const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
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

const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex: 1;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const RingWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SvgRing = styled.svg`
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const CircleBg = styled.circle`
  fill: none;
  stroke: #f1f5f9;
  stroke-width: 12;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: ${props => props.color};
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: ${props => props.circumference};
  stroke-dashoffset: ${props => props.dashoffset};
  transition: stroke-dashoffset 1s ease-in-out;
`;

const RingInnerText = styled.div`
  position: absolute;
  text-align: center;
`;

const Score = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
`;

const ScoreLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.2rem;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  flex: 1;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Dot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
`;

const LabelGroup = styled.div`
  flex: 1;
`;

const LabelText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #334155;
`;

const SubText = styled.div`
  font-size: 0.75rem;
  color: #64748b;
`;

export default function LifeBalanceRing({
    studyHours = 35,
    passionHours = 12,
    restHours = 56
}) {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;

    // Calculate a mock "Balance Score" out of 100
    const totalWakingHours = 112; // 16 hours * 7 days
    const activeHours = studyHours + passionHours;
    const rawScore = (activeHours / totalWakingHours) * 100;
    const score = Math.min(Math.max(Math.round(rawScore + 30), 0), 100); // Bumped up for demo

    const dashoffset = circumference - (score / 100) * circumference;

    let ringColor = "#10b981"; // Green (Good balance)
    if (score < 40) ringColor = "#f59e0b"; // Yellow (Needs attention)
    if (score > 90) ringColor = "#ef4444"; // Red (Overworking / Burnout risk)

    return (
        <Card
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
        >
            <Title>
                <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" width="20" height="20">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Life Balance
            </Title>

            <ChartContainer>
                <RingWrapper>
                    <SvgRing>
                        <CircleBg cx="70" cy="70" r={radius} />
                        <CircleProgress
                            cx="70"
                            cy="70"
                            r={radius}
                            color={ringColor}
                            circumference={circumference}
                            dashoffset={dashoffset}
                        />
                    </SvgRing>
                    <RingInnerText>
                        <Score>{score}</Score>
                        <ScoreLabel>Score</ScoreLabel>
                    </RingInnerText>
                </RingWrapper>

                <Legend>
                    <LegendItem>
                        <Dot color="#8b5cf6" />
                        <LabelGroup>
                            <LabelText>Academics</LabelText>
                            <SubText>{studyHours}h this week</SubText>
                        </LabelGroup>
                    </LegendItem>

                    <LegendItem>
                        <Dot color="#ec4899" />
                        <LabelGroup>
                            <LabelText>Passions & Hobbies</LabelText>
                            <SubText>{passionHours}h this week</SubText>
                        </LabelGroup>
                    </LegendItem>

                    <LegendItem>
                        <Dot color="#3b82f6" />
                        <LabelGroup>
                            <LabelText>Rest & Recovery</LabelText>
                            <SubText>{restHours}h this week</SubText>
                        </LabelGroup>
                    </LegendItem>
                </Legend>
            </ChartContainer>
        </Card>
    );
}
