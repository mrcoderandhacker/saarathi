import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabase";

/* ---- STYLES ---- */
const Wrap = styled(motion.div)`
  background: linear-gradient(135deg, #0f172a, #1e1b4b);
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
  color: white;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -40px; right: -40px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: rgba(99, 102, 241, 0.15);
    pointer-events: none;
  }
`;

const Left = styled.div``;

const StreakNum = styled.div`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1;
  margin-bottom: 0.2rem;
`;
const StreakLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const WeekDots = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 0.8rem;
`;

const Dot = styled.div`
  width: 28px;
  height: 8px;
  border-radius: 4px;
  background: ${p => p.done ? '#6366f1' : 'rgba(255,255,255,0.1)'};
  transition: background 0.3s;
`;

const DayLabel = styled.div`
  display: flex;
  gap: 5px;
  margin-top: 4px;
`;

const DayText = styled.div`
  width: 28px;
  font-size: 0.62rem;
  color: rgba(255,255,255,0.4);
  text-align: center;
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
`;

const FlameEmoji = styled.div`
  font-size: 2.4rem;
  line-height: 1;
`;

const RecordBadge = styled.div`
  font-size: 0.7rem;
  opacity: 0.6;
  text-align: center;
`;

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function StreakBanner({ user }) {
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);
    const [weekActivity, setWeekActivity] = useState([false, false, false, false, false, false, false]);

    useEffect(() => {
        if (user) fetchStreak();
    }, [user]);

    const fetchStreak = async () => {
        try {
            // Get last 30 days of completions
            const since = new Date();
            since.setDate(since.getDate() - 29);
            const { data } = await supabase
                .from("task_completions")
                .select("completed_date")
                .eq("user_id", user.id)
                .gte("completed_date", since.toISOString().split("T")[0])
                .order("completed_date", { ascending: false });

            if (!data || data.length === 0) return;

            // Build set of unique active days
            const activeDays = new Set(data.map(d => d.completed_date));

            // Last 7 days activity
            const today = new Date();
            const week = Array.from({ length: 7 }, (_, i) => {
                const d = new Date(today);
                d.setDate(today.getDate() - (6 - i));
                return d.toISOString().split("T")[0];
            });
            setWeekActivity(week.map(d => activeDays.has(d)));

            // Current streak (counting backwards from today)
            let currentStreak = 0;
            const check = new Date();
            while (true) {
                const dateStr = check.toISOString().split("T")[0];
                if (activeDays.has(dateStr)) {
                    currentStreak++;
                    check.setDate(check.getDate() - 1);
                } else {
                    break;
                }
            }
            setStreak(currentStreak);

            // Best streak
            const allDates = [...activeDays].sort();
            let best = 0, cur = 0;
            for (let i = 0; i < allDates.length; i++) {
                if (i === 0) { cur = 1; continue; }
                const prev = new Date(allDates[i - 1]);
                const curr = new Date(allDates[i]);
                const diff = (curr - prev) / (1000 * 60 * 60 * 24);
                if (diff === 1) { cur++; } else { cur = 1; }
                if (cur > best) best = cur;
            }
            setBestStreak(Math.max(best, currentStreak));
        } catch (e) {
            console.error("Streak error:", e);
        }
    };

    if (!user) return null;

    // Start from Sunday of current week
    const todayDayIdx = new Date().getDay();

    return (
        <Wrap initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Left>
                <StreakNum>{streak} day{streak !== 1 ? "s" : ""} 🔥</StreakNum>
                <StreakLabel>Current streak · keep the momentum going</StreakLabel>

                <WeekDots>
                    {weekActivity.map((done, i) => (
                        <Dot key={i} done={done} />
                    ))}
                </WeekDots>
                <DayLabel>
                    {Array.from({ length: 7 }, (_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        return <DayText key={i}>{DAYS[d.getDay()]}</DayText>;
                    })}
                </DayLabel>
            </Left>

            <Right>
                <FlameEmoji>{streak >= 7 ? "🔥" : streak >= 3 ? "⚡" : "✨"}</FlameEmoji>
                <RecordBadge>Best<br />{bestStreak} days</RecordBadge>
            </Right>
        </Wrap>
    );
}
