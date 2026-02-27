import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { GeneralWidgetSkeleton } from "./Skeletons";

/* ---- STYLES ---- */
const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WeekBadge = styled.div`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin-bottom: 1.2rem;
`;

const StatBox = styled.div`
  background: ${p => p.bg || '#f8fafc'};
  border-radius: 12px;
  padding: 0.8rem;
  text-align: center;
`;

const StatNum = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${p => p.color || '#111827'};
  line-height: 1;
`;

const StatLabel = styled.div`
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 0.25rem;
  font-weight: 500;
`;

const ChartSection = styled.div``;

const ChartTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.6rem;
`;

const BarsRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 60px;
`;

const BarWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  height: 100%;
  justify-content: flex-end;
`;

const Bar = styled.div`
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: ${p => p.color || '#6366f1'};
  height: ${p => p.pct}%;
  min-height: 3px;
  transition: height 0.5s ease;
`;

const BarDayLabel = styled.div`
  font-size: 0.62rem;
  color: ${p => p.today ? '#6366f1' : '#94a3b8'};
  font-weight: ${p => p.today ? '700' : '400'};
`;

const InsightSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
`;

const InsightItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #374151;
  padding: 0.3rem 0;
  line-height: 1.4;
`;

const DAYS_SHORT = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const getWeekStart = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().split("T")[0];
};

export default function WeeklyReport({ user }) {
  const [weekData, setWeekData] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalGoalsDone, setTotalGoalsDone] = useState(0);
  const [journalCount, setJournalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchWeeklyData();
    else setLoading(false);
  }, [user]);

  const fetchWeeklyData = async () => {
    setLoading(true);
    try {
      const weekStart = getWeekStart();
      const today = new Date().toISOString().split("T")[0];

      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
      });

      const [
        { data: completions },
        { data: journalData }
      ] = await Promise.all([
        supabase.from("task_completions").select("completed_date")
          .eq("user_id", user.id).gte("completed_date", weekStart),
        supabase.from("journal_entries").select("id")
          .eq("user_id", user.id).gte("created_at", weekStart + "T00:00:00")
      ]);

      const byDay = {};
      days.forEach(d => { byDay[d] = 0; });
      (completions || []).forEach(c => {
        if (byDay[c.completed_date] !== undefined) byDay[c.completed_date]++;
      });

      setWeekData(days.map(d => ({ date: d, count: byDay[d] })));
      setTotalTasks((completions || []).length);
      setJournalCount((journalData || []).length);
    } catch (e) {
      console.error("Weekly report error:", e);
    } finally { setLoading(false); }
  };

  if (!user) return null;
  if (loading) return <GeneralWidgetSkeleton />;

  const maxCount = Math.max(...weekData.map(d => d.count), 1);
  const todayStr = new Date().toISOString().split("T")[0];
  const avgDaily = totalTasks > 0 ? (totalTasks / 7).toFixed(1) : "0";

  const bestDay = weekData.reduce((best, d) => d.count > best.count ? d : best, weekData[0] || { count: 0, date: todayStr });

  const insights = [];
  if (totalTasks === 0) insights.push({ emoji: "💡", text: "Start checking off daily tasks to see your weekly progress here." });
  else {
    if (totalTasks >= 20) insights.push({ emoji: "🏆", text: "Incredible week! You completed " + totalTasks + " tasks." });
    else if (totalTasks >= 10) insights.push({ emoji: "⚡", text: "Great week with " + totalTasks + " tasks completed." });
    else insights.push({ emoji: "📈", text: totalTasks + " tasks this week. Try to hit 10 next week!" });

    if (journalCount > 0) insights.push({ emoji: "📓", text: "You journaled " + journalCount + " time" + (journalCount > 1 ? "s" : "") + " this week. Keep reflecting!" });
    else insights.push({ emoji: "📝", text: "No journal entries this week. Even one sentence a day helps." });

    if (bestDay.count > 0) {
      const bestDayName = new Date(bestDay.date + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long" });
      insights.push({ emoji: "🌟", text: `${bestDayName} was your best day with ${bestDay.count} tasks completed!` });
    }
  }

  return (
    <Card initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Header>
        <Title>📋 Weekly Summary</Title>
        <WeekBadge>Last 7 days</WeekBadge>
      </Header>

      <StatsRow>
        <StatBox bg="#f0fdf4">
          <StatNum color="#16a34a">{totalTasks}</StatNum>
          <StatLabel>Tasks Done</StatLabel>
        </StatBox>
        <StatBox bg="#faf5ff">
          <StatNum color="#9333ea">{avgDaily}</StatNum>
          <StatLabel>Avg / Day</StatLabel>
        </StatBox>
        <StatBox bg="#eff6ff">
          <StatNum color="#2563eb">{journalCount}</StatNum>
          <StatLabel>Journal Entries</StatLabel>
        </StatBox>
      </StatsRow>

      <ChartSection>
        <ChartTitle>Daily Task Completions</ChartTitle>
        <BarsRow>
          {weekData.map((d, i) => {
            const dayIdx = new Date(d.date + "T12:00:00").getDay();
            const isToday = d.date === todayStr;
            const pct = maxCount > 0 ? Math.round((d.count / maxCount) * 100) : 0;
            return (
              <BarWrap key={d.date}>
                <Bar pct={pct} color={isToday ? "#6366f1" : "#c7d2fe"} title={`${d.count} tasks`} />
                <BarDayLabel today={isToday}>{DAYS_SHORT[dayIdx]}</BarDayLabel>
              </BarWrap>
            );
          })}
        </BarsRow>
      </ChartSection>

      <InsightSection>
        {insights.map((ins, i) => (
          <InsightItem key={i}>
            <span>{ins.emoji}</span>
            <span>{ins.text}</span>
          </InsightItem>
        ))}
      </InsightSection>
    </Card>
  );
}
