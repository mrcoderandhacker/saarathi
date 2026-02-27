import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.2rem 1.4rem;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  margin-bottom: 1.2rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Left = styled.div``;

const Question = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.1rem;
`;

const Sub = styled.div`
  font-size: 0.78rem;
  color: #9ca3af;
`;

const MoodRow = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const MoodBtn = styled.button`
  background: ${p => p.selected ? MOOD_META[p.mood]?.bg : '#f8fafc'};
  border: 1.5px solid ${p => p.selected ? MOOD_META[p.mood]?.color : '#e2e8f0'};
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
  color: ${p => p.selected ? MOOD_META[p.mood]?.color : '#6b7280'};
  font-weight: ${p => p.selected ? '600' : '400'};
  &:hover { border-color: ${p => MOOD_META[p.mood]?.color}; }
`;

const DoneState = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
`;

const DoneDot = styled.div`
  width: 8px; height: 8px; border-radius: 50%;
  background: ${p => p.color || '#10b981'};
`;

const MOODS = [
    { key: "great", label: "😊 Great" },
    { key: "good", label: "🙂 Good" },
    { key: "okay", label: "😐 Okay" },
    { key: "tired", label: "😔 Tired" },
    { key: "stressed", label: "😤 Stressed" },
];

const MOOD_META = {
    great: { color: "#10b981", bg: "#f0fdf4" },
    good: { color: "#6366f1", bg: "#ede9fe" },
    okay: { color: "#f59e0b", bg: "#fffbeb" },
    tired: { color: "#3b82f6", bg: "#eff6ff" },
    stressed: { color: "#ef4444", bg: "#fef2f2" },
};

export default function DailyCheckin({ user }) {
    const [todayMood, setTodayMood] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (user) fetchToday();
        else setLoaded(true);
    }, [user]);

    const fetchToday = async () => {
        const { data } = await supabase
            .from("daily_checkins")
            .select("mood")
            .eq("user_id", user.id)
            .eq("checked_in_date", today)
            .maybeSingle();
        if (data) setTodayMood(data.mood);
        setLoaded(true);
    };

    const saveMood = async (mood) => {
        if (saving) return;
        setSaving(true);
        setTodayMood(mood);
        try {
            await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });
            await supabase.from("daily_checkins").upsert(
                { user_id: user.id, mood, checked_in_date: today },
                { onConflict: "user_id,checked_in_date" }
            );
        } catch (e) { console.error(e); }
        finally { setSaving(false); }
    };

    if (!user || !loaded) return null;

    const moodInfo = MOOD_META[todayMood];
    const moodLabel = MOODS.find(m => m.key === todayMood)?.label;

    return (
        <Card initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Row>
                <Left>
                    <Question>How are you feeling today?</Question>
                    <Sub>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</Sub>
                </Left>

                <AnimatePresence mode="wait">
                    {todayMood ? (
                        <DoneState key="done">
                            <DoneDot color={moodInfo?.color} />
                            Checked in as <strong>{moodLabel}</strong>
                            <button
                                style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "0.78rem", padding: 0 }}
                                onClick={() => setTodayMood(null)}
                            >
                                change
                            </button>
                        </DoneState>
                    ) : (
                        <MoodRow key="moods">
                            {MOODS.map(m => (
                                <MoodBtn
                                    key={m.key}
                                    mood={m.key}
                                    selected={todayMood === m.key}
                                    onClick={() => saveMood(m.key)}
                                >
                                    {m.label}
                                </MoodBtn>
                            ))}
                        </MoodRow>
                    )}
                </AnimatePresence>
            </Row>
        </Card>
    );
}
