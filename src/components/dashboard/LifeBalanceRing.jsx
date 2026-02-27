import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { ChartWidgetSkeleton } from "./Skeletons";

/* ---- STYLES ---- */
const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const Title = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ScorePill = styled.div`
  background: ${p => p.color || '#10b981'}22;
  color: ${p => p.color || '#10b981'};
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
`;

/* Ring */
const ChartRow = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.2rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const RingWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
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
  stroke-width: 10;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: ${p => p.color};
  stroke-width: 10;
  stroke-linecap: round;
  stroke-dasharray: ${p => p.circumference};
  stroke-dashoffset: ${p => p.dashoffset};
  transition: stroke-dashoffset 1s ease;
`;

const RingCenter = styled.div`
  position: absolute;
  text-align: center;
`;

const ScoreNum = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
`;

const ScoreLbl = styled.div`
  font-size: 0.65rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Legend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const LegItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
`;

const LegLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
`;

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.color};
  flex-shrink: 0;
`;

const LegHours = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
`;

/* Weekly bar chart */
const ChartSection = styled.div`
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

const ChartTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
`;

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 70px;
`;

const BarCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  height: 100%;
  justify-content: flex-end;
`;

const Bar = styled.div`
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: ${p => p.color};
  height: ${p => p.height}%;
  transition: height 0.6s ease;
  min-height: 3px;
`;

const BarDay = styled.div`
  font-size: 0.65rem;
  color: ${p => p.today ? '#6366f1' : '#94a3b8'};
  font-weight: ${p => p.today ? '700' : '400'};
`;

/* Interests section */
const InterestSection = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

const InterestTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
`;

const InterestRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const InterestChip = styled.button`
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  background: ${p => p.selected ? '#e0e7ff' : '#f1f5f9'};
  color: ${p => p.selected ? '#4f46e5' : '#6b7280'};
  transition: all 0.15s;
  &:hover { background: #e0e7ff; color: #4f46e5; }
`;

const SaveInterestsBtn = styled.button`
  margin-top: 0.7rem;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #059669; }
`;

const ToDoSection = styled.div`
  margin-top: 0.8rem;
`;

const ToDoTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const ToDoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #374151;
  padding: 0.3rem 0;
`;

const Overlay = styled.div`
  position: absolute; top:0; left:0; right:0; bottom:0;
  background: rgba(255,255,255,0.6); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; text-align: center; padding: 1rem;
`;
const LockIcon = styled.div`
  width: 48px; height: 48px; background: #111827; color: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;
`;
const OverlayText = styled.h4`font-size: 1.1rem; color: #111827; font-weight: 600; margin-bottom: 0.5rem;`;
const OverlayButton = styled.button`
  background: #111827; color: white; border: none; padding: 0.6rem 1.2rem;
  border-radius: 999px; font-size: 0.9rem; cursor: pointer; margin-top: 0.5rem;
  &:hover { background: #1f2937; }
`;

/* ---- CONSTANTS ---- */
const INTEREST_OPTIONS = [
  "Music", "Sports", "Art", "Coding", "Reading",
  "Film", "Cooking", "Travel", "Dance", "Gaming",
  "Photography", "Writing", "Theatre", "Yoga", "Nature"
];

const INTEREST_TODOS = {
  "Music": ["Practice instrument 30 min", "Listen to 1 new track"],
  "Sports": ["Go for a run / play sport", "Stretch for 10 min"],
  "Art": ["Sketch or doodle for 20 min", "Study 1 artwork"],
  "Coding": ["Build a mini project", "Solve 1 coding challenge"],
  "Reading": ["Read for 30 min", "Note 3 key ideas from a book"],
  "Film": ["Watch 1 short film or documentary clip"],
  "Cooking": ["Try cooking one new thing"],
  "Dance": ["Practice your moves for 20 min"],
  "Gaming": ["Play for 1 hour (limit yourself!)"],
  "Photography": ["Take 5 interesting photos"],
  "Yoga": ["Do a 20 min yoga session"],
  "Nature": ["Spend 30 min outdoors"],
};

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function LifeBalanceRing({ user }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studyHours, setStudyHours] = useState(0);
  const [passionHours, setPassionHours] = useState(0);
  const [restHours, setRestHours] = useState(0);
  const [weeklyData, setWeeklyData] = useState([]); // [{date, academic, passion, rest}]
  const [interests, setInterests] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [savingInterests, setSavingInterests] = useState(false);

  const todayIdx = new Date().getDay();

  useEffect(() => {
    if (user) fetchData();
    else setLoading(false);
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });

      // Get last 7 days
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });

      const [{ data: logsData }, { data: profile }] = await Promise.all([
        supabase.from("balance_logs").select("*").eq("user_id", user.id)
          .gte("logged_date", days[0]).lte("logged_date", days[6]),
        supabase.from("profiles").select("interests").eq("id", user.id).maybeSingle()
      ]);

      // Aggregate by day
      const byDay = {};
      days.forEach(d => { byDay[d] = { academic: 0, passion: 0, rest: 0 }; });
      (logsData || []).forEach(log => {
        if (byDay[log.logged_date]) {
          byDay[log.logged_date][log.log_type] = (byDay[log.logged_date][log.log_type] || 0) + Number(log.hours_spent);
        }
      });

      const weekArr = days.map(d => ({ date: d, ...byDay[d] }));
      setWeeklyData(weekArr);

      // This week totals
      let acad = 0, pass = 0, rest = 0;
      Object.values(byDay).forEach(d => { acad += d.academic; pass += d.passion; rest += d.rest; });
      setStudyHours(acad);
      setPassionHours(pass);
      setRestHours(rest);

      // Interests
      if (profile?.interests?.length) {
        setInterests(profile.interests);
        setSelectedInterests(profile.interests);
      }
    } catch (e) {
      console.error("Error fetching balance data:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveInterests = async () => {
    setSavingInterests(true);
    await supabase.from("profiles").upsert({ id: user.id, interests: selectedInterests }, { onConflict: "id" });
    setInterests(selectedInterests);
    setSavingInterests(false);
  };

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  // Balance ring score
  const totalWaking = 112;
  const active = studyHours + passionHours;
  const score = Math.min(Math.max(Math.round((active / totalWaking) * 100 + 30), 0), 100);
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference - (score / 100) * circumference;
  let ringColor = "#10b981";
  if (score < 40) ringColor = "#f59e0b";
  if (score > 85) ringColor = "#ef4444";

  // Max hours in week for bar scale
  const maxH = Math.max(...weeklyData.map(d => d.academic + d.passion + d.rest), 1);

  // Personalised todos from interests
  const todos = interests.flatMap(i => INTEREST_TODOS[i] || []).slice(0, 4);

  return (
    <Card initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Header>
        <Title>
          <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" width="20" height="20">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          Life Balance
        </Title>
        <ScorePill color={ringColor}>{score}/100</ScorePill>
      </Header>

      <ChartRow>
        <RingWrapper>
          <SvgRing viewBox="0 0 120 120">
            <CircleBg cx="60" cy="60" r={radius} />
            <CircleProgress cx="60" cy="60" r={radius} color={ringColor} circumference={circumference} dashoffset={dashoffset} />
          </SvgRing>
          <RingCenter>
            <ScoreNum>{score}</ScoreNum>
            <ScoreLbl>Score</ScoreLbl>
          </RingCenter>
        </RingWrapper>

        <Legend>
          {[
            { label: "Academics", hours: studyHours, color: "#8b5cf6" },
            { label: "Passions", hours: passionHours, color: "#ec4899" },
            { label: "Rest", hours: restHours, color: "#3b82f6" },
          ].map(item => (
            <LegItem key={item.label}>
              <LegLeft>
                <Dot color={item.color} />
                {item.label}
              </LegLeft>
              <LegHours>{item.hours.toFixed(1)}h this week</LegHours>
            </LegItem>
          ))}
        </Legend>
      </ChartRow>

      {/* Weekly Bar Chart */}
      <ChartSection>
        <ChartTitle>Week in Hours</ChartTitle>
        <Bars>
          {weeklyData.map((d, i) => {
            const total = d.academic + d.passion + d.rest;
            const pct = total > 0 ? Math.round((total / maxH) * 100) : 0;
            const dayIdx = new Date(d.date + "T12:00:00").getDay();
            return (
              <BarCol key={d.date}>
                <Bar color="#8b5cf6" height={pct * (d.academic / (total || 1))} title={`Academic: ${d.academic}h`} />
                <Bar color="#ec4899" height={pct * (d.passion / (total || 1))} title={`Passion: ${d.passion}h`} />
                <Bar color="#3b82f6" height={pct * (d.rest / (total || 1))} title={`Rest: ${d.rest}h`} />
                <BarDay today={dayIdx === todayIdx}>{DAYS[dayIdx]}</BarDay>
              </BarCol>
            );
          })}
        </Bars>
      </ChartSection>

      {/* Interests + personalised to-dos */}
      {user && (
        <InterestSection>
          <InterestTitle>Your Interests</InterestTitle>
          <InterestRow>
            {INTEREST_OPTIONS.map(opt => (
              <InterestChip
                key={opt}
                selected={selectedInterests.includes(opt)}
                onClick={() => toggleInterest(opt)}
              >
                {opt}
              </InterestChip>
            ))}
          </InterestRow>
          {JSON.stringify(selectedInterests) !== JSON.stringify(interests) && (
            <SaveInterestsBtn onClick={saveInterests} disabled={savingInterests}>
              {savingInterests ? "Saving..." : "Save Interests ✓"}
            </SaveInterestsBtn>
          )}

          {todos.length > 0 && (
            <ToDoSection>
              <ToDoTitle>Today's Balance To-Dos</ToDoTitle>
              {todos.map((todo, i) => (
                <ToDoItem key={i}>
                  <span style={{ color: "#10b981" }}>✦</span>
                  {todo}
                </ToDoItem>
              ))}
            </ToDoSection>
          )}
        </InterestSection>
      )}

      {!user && (
        <Overlay>
          <LockIcon>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </LockIcon>
          <OverlayText>Log in to see your balance</OverlayText>
          <OverlayButton onClick={() => navigate("/login")}>Login</OverlayButton>
        </Overlay>
      )}
    </Card>
  );
}
