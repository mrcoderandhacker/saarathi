import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
import { Check, X } from "lucide-react";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalCard = styled(motion.div)`
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 24px;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
  overflow: hidden;
`;

const TopDeco = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
`;

const Title = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
`;

const Sub = styled.p`
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 2.5rem;
`;

const QuestionLabel = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
  text-align: left;
`;

const MoodGrid = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const MoodBtn = styled(motion.button)`
  flex: 1;
  background: ${p => p.selected ? p.bg : '#f8fafc'};
  border: 2px solid ${p => p.selected ? p.color : 'transparent'};
  border-radius: 16px;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  span {
    font-size: 1.5rem;
  }
  
  small {
    font-size: 0.75rem;
    font-weight: ${p => p.selected ? '700' : '500'};
    color: ${p => p.selected ? p.color : '#64748b'};
  }

  &:hover {
    background: ${p => p.bg}55;
    transform: translateY(-2px);
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.2rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  margin-bottom: 2rem;
  font-family: inherit;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
  }
`;

const SubmitBtn = styled(motion.button)`
  width: 100%;
  padding: 1.1rem;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${p => p.disabled ? 0.7 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
`;

const MOODS = [
    { key: "great", emoji: "🤩", label: "Great", color: "#10b981", bg: "#d1fae5" },
    { key: "good", emoji: "🙂", label: "Good", color: "#3b82f6", bg: "#dbeafe" },
    { key: "okay", emoji: "😐", label: "Okay", color: "#f59e0b", bg: "#fef3c7" },
    { key: "tired", emoji: "🥱", label: "Tired", color: "#8b5cf6", bg: "#ede9fe" },
    { key: "stressed", emoji: "😫", label: "Stressed", color: "#ef4444", bg: "#fee2e2" },
];

export default function DailyGreetingModal({ user, onComplete }) {
    const [mood, setMood] = useState(null);
    const [goal, setGoal] = useState("");
    const [loading, setLoading] = useState(false);

    // If we close it early, just mark it complete without saving
    const handleClose = () => onComplete();

    const handleSubmit = async () => {
        if (!mood || loading) return;
        setLoading(true);

        try {
            const today = new Date().toISOString().split("T")[0];

            // 1. Save the checkin
            await supabase.from("daily_checkins").upsert({
                user_id: user.id,
                checked_in_date: today,
                mood: mood,
            }, { onConflict: "user_id,checked_in_date" });

            // 2. Add goal as a task if provided
            if (goal.trim()) {
                await supabase.from("daily_tasks").insert({
                    user_id: user.id,
                    title: goal.trim(),
                    category: "academic",
                    time_slot: "morning",
                    color: "#6366f1"
                });
            }

            // 3. Update Gamification Streak
            // Get profile current streak
            const { data: profile } = await supabase
                .from("profiles")
                .select("current_streak, last_checkin_date")
                .eq("id", user.id)
                .single();

            if (profile) {
                let newStreak = profile.current_streak || 0;

                // Very basic streak logic (if last checkin was yesterday, increment)
                // If they miss a day, it resets. If it's today, ignore.
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yStr = yesterday.toISOString().split("T")[0];

                if (profile.last_checkin_date === yStr) {
                    newStreak += 1;
                } else if (profile.last_checkin_date !== today) {
                    newStreak = 1; // reset to 1
                }

                await supabase.from("profiles").update({
                    current_streak: newStreak,
                    last_checkin_date: today
                }).eq("id", user.id);
            }

        } catch (error) {
            console.error("Error saving daily greeting:", error);
        } finally {
            setLoading(false);
            onComplete(); // Close modal and refresh dashboard
        }
    };

    return (
        <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <ModalCard
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                <TopDeco />
                <CloseBtn onClick={handleClose}><X size={20} /></CloseBtn>

                <Title>Good Morning!</Title>
                <Sub>Let's set your intention for the day.</Sub>

                <QuestionLabel>How are you feeling right now?</QuestionLabel>
                <MoodGrid>
                    {MOODS.map(m => (
                        <MoodBtn
                            key={m.key}
                            selected={mood === m.key}
                            bg={m.bg}
                            color={m.color}
                            onClick={() => setMood(m.key)}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span>{m.emoji}</span>
                            <small>{m.label}</small>
                        </MoodBtn>
                    ))}
                </MoodGrid>

                <AnimatePresence>
                    {mood && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <QuestionLabel>What is your ONE main goal for today?</QuestionLabel>
                            <Input
                                placeholder="e.g., Finish Physics Chapter 4..."
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                autoFocus
                                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                <SubmitBtn
                    disabled={!mood || loading}
                    onClick={handleSubmit}
                    whileHover={mood ? { scale: 1.02 } : {}}
                    whileTap={mood ? { scale: 0.98 } : {}}
                >
                    {loading ? "Let's go..." : "Start My Day"} <Check size={18} />
                </SubmitBtn>
            </ModalCard>
        </Overlay>
    );
}
