import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { GeneralWidgetSkeleton } from "./Skeletons";

/* ---- STYLES ---- */
const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.05);
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

const ScoreBadge = styled.div`
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const WeekRow = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 1rem;
`;

const DayColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${p => p.today ? '#6366f1' : '#9ca3af'};
  padding-bottom: 4px;
  border-bottom: 2px solid ${p => p.today ? '#6366f1' : 'transparent'};
`;

const TaskChip = styled.div`
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 0.68rem;
  font-weight: 600;
  color: white;
  background: ${p => p.color || '#6366f1'};
  opacity: ${p => p.done ? 0.5 : 1};
  cursor: ${p => p.isToday ? 'pointer' : 'default'};
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.2s;
  position: relative;

  ${p => p.done && `
    text-decoration: line-through;
  `}
`;

const TodaySection = styled.div`
  margin-top: 1rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

const TodayTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.7rem;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TaskRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #f1f5f9; }

  .delete-btn {
    opacity: 0;
    color: #ef4444;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.3rem;
    display: flex;
    align-items: center;
    border-radius: 4px;
    transition: all 0.2s;
  }

  &:hover .delete-btn {
    opacity: 0.7;
  }

  .delete-btn:hover {
    opacity: 1 !important;
    background: #fee2e2;
  }
`;

const EmptyStateGraphic = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  text-align: center;
  
  svg { margin-bottom: 1rem; opacity: 0.8; }
  h4 { color: #334155; margin-bottom: 0.3rem; font-size: 0.95rem; font-weight: 600; }
  p { font-size: 0.8rem; max-width: 220px; line-height: 1.4; margin: 0;}
`;

const CheckCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${p => p.done ? p.color : '#cbd5e1'};
  background: ${p => p.done ? p.color : 'transparent'};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;

const TaskName = styled.span`
  font-size: 0.9rem;
  color: #374151;
  flex: 1;
  text-decoration: ${p => p.done ? 'line-through' : 'none'};
  color: ${p => p.done ? '#9ca3af' : '#374151'};
`;

const CategoryTag = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background: ${p => p.color}22;
  color: ${p => p.color};
`;

const AddBtn = styled.button`
  width: 100%;
  margin-top: 0.8rem;
  padding: 0.6rem;
  border: 1.5px dashed #e2e8f0;
  border-radius: 10px;
  background: transparent;
  color: #6366f1;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #f0f0ff; border-color: #6366f1; }
`;

const Modal = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
  input, select { 
    width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px;
    font-size: 0.9rem; outline: none; box-sizing: border-box;
    &:focus { border-color: #6366f1; }
  }
`;

const DayPicker = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const DayToggle = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid ${p => p.selected ? '#6366f1' : '#e2e8f0'};
  background: ${p => p.selected ? '#6366f1' : 'transparent'};
  color: ${p => p.selected ? 'white' : '#6b7280'};
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
`;

const ColorPicker = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ColorDot = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${p => p.color};
  border: 3px solid ${p => p.selected ? '#0f172a' : 'transparent'};
  cursor: pointer;
  transition: transform 0.15s;
  &:hover { transform: scale(1.1); }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background: #f1f5f9; border: none; padding: 0.6rem 1.2rem;
  border-radius: 8px; font-size: 0.9rem; cursor: pointer; color: #64748b;
  &:hover { background: #e2e8f0; }
`;

const SaveBtn = styled.button`
  background: #6366f1; color: white; border: none; padding: 0.6rem 1.5rem;
  border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  &:hover { background: #4f46e5; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const EmptyText = styled.div`
  text-align: center;
  color: #9ca3af;
  font-size: 0.9rem;
  padding: 1rem 0;
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
const OverlayText = styled.h4` font-size: 1.1rem; color: #111827; font-weight: 600; margin-bottom: 0.5rem; `;
const OverlayButton = styled.button`
  background: #111827; color: white; border: none; padding: 0.6rem 1.2rem;
  border-radius: 999px; font-size: 0.9rem; cursor: pointer; margin-top: 0.5rem;
  &:hover { background: #1f2937; }
`;

/* ---- CONSTANTS ---- */
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const COLORS = ["#6366f1", "#ec4899", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];
const CATEGORIES = ["academic", "passion", "health", "social", "rest"];

/* ---- COMPONENT ---- */
export default function DailyRoutine({ user }) {
    const navigate = useNavigate();
    const today = new Date().getDay();

    const [tasks, setTasks] = useState([]);
    const [completions, setCompletions] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [form, setForm] = useState({
        title: "",
        category: "academic",
        time_slot: "morning",
        days: [1, 2, 3, 4, 5],
        color: COLORS[0],
        duration_minutes: 60
    });

    const todayStr = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (user) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Ensure profile row exists
            await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });

            const [{ data: taskData }, { data: compData }] = await Promise.all([
                supabase.from("daily_tasks").select("*").eq("user_id", user.id).order("time_slot"),
                supabase.from("task_completions").select("task_id").eq("user_id", user.id).eq("completed_date", todayStr)
            ]);

            setTasks(taskData || []);
            setCompletions(new Set((compData || []).map(c => c.task_id)));
        } catch (e) {
            console.error("Error fetching routine:", e);
        } finally {
            setLoading(false);
        }
    };

    const toggleCompletion = async (taskId) => {
        const isDone = completions.has(taskId);
        const newSet = new Set(completions);

        if (isDone) {
            newSet.delete(taskId);
            await supabase.from("task_completions").delete()
                .eq("task_id", taskId).eq("completed_date", todayStr);
        } else {
            newSet.add(taskId);
            await supabase.from("task_completions").upsert({
                user_id: user.id, task_id: taskId, completed_date: todayStr
            }, { onConflict: "task_id,completed_date" });
        }
        setCompletions(newSet);
    };

    const saveTask = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        try {
            const { data, error } = await supabase.from("daily_tasks").insert({
                user_id: user.id,
                title: form.title.trim(),
                category: form.category,
                time_slot: form.time_slot,
                days_of_week: form.days,
                color: form.color,
                duration_minutes: Number(form.duration_minutes)
            }).select().single();

            if (error) throw error;
            setTasks(prev => [...prev, data]);
            setShowModal(false);
            setForm({ title: "", category: "academic", time_slot: "morning", days: [1, 2, 3, 4, 5], color: COLORS[0], duration_minutes: 60 });
        } catch (e) {
            console.error("Error saving task:", e);
        } finally {
            setSaving(false);
        }
    };

    const deleteTask = async (e, id) => {
        e.stopPropagation();
        setSaving(true);
        try {
            await supabase.from("daily_tasks").delete().eq("id", id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setSaving(false);
        }
    };

    const toggleDay = (d) => {
        setForm(f => ({
            ...f,
            days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d]
        }));
    };

    // Tasks for today
    const todayTasks = tasks.filter(t => t.days_of_week?.includes(today));

    // Score: completions today / tasks scheduled today
    const score = todayTasks.length > 0
        ? Math.round((completions.size / todayTasks.length) * 100)
        : null;

    // Tasks for each day
    const tasksByDay = DAYS.map((_, dayIdx) =>
        tasks.filter(t => t.days_of_week?.includes(dayIdx))
    );

    return (
        <>
            <Card
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <Header>
                    <Title>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" width="20" height="20">
                            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Daily Routine
                    </Title>
                    {score !== null && (
                        <ScoreBadge>{score}% today</ScoreBadge>
                    )}
                </Header>

                {/* Weekly mini-grid */}
                <WeekRow>
                    {DAYS.map((day, dayIdx) => (
                        <DayColumn key={dayIdx}>
                            <DayLabel today={dayIdx === today}>{day}</DayLabel>
                            {tasksByDay[dayIdx].slice(0, 3).map(t => (
                                <TaskChip
                                    key={t.id}
                                    color={t.color}
                                    isToday={dayIdx === today}
                                    done={dayIdx === today && completions.has(t.id)}
                                    title={t.title}
                                >
                                    {t.title.substring(0, 6)}{t.title.length > 6 ? "…" : ""}
                                </TaskChip>
                            ))}
                            {tasksByDay[dayIdx].length > 3 && (
                                <TaskChip color="#94a3b8" style={{ fontSize: "0.65rem" }}>
                                    +{tasksByDay[dayIdx].length - 3}
                                </TaskChip>
                            )}
                        </DayColumn>
                    ))}
                </WeekRow>

                {/* Today's tasks */}
                <TodaySection>
                    <TodayTitle>Today — {DAY_NAMES[today]}</TodayTitle>
                    {loading ? (
                        <GeneralWidgetSkeleton />
                    ) : todayTasks.length > 0 ? (
                        <TaskList>
                            {todayTasks.map(task => (
                                <TaskRow key={task.id} onClick={() => user && toggleCompletion(task.id)}>
                                    <CheckCircle done={completions.has(task.id)} color={task.color}>
                                        {completions.has(task.id) && (
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </CheckCircle>
                                    <TaskName done={completions.has(task.id)}>{task.title}</TaskName>
                                    <CategoryTag color={task.color}>{task.category}</CategoryTag>
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => deleteTask(e, task.id)}
                                        title="Delete recurring task"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                    </button>
                                </TaskRow>
                            ))}
                        </TaskList>
                    ) : (
                        <EmptyStateGraphic
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <h4>A clean slate</h4>
                            <p>You have no recurring tasks scheduled for today.</p>
                        </EmptyStateGraphic>
                    )}

                    {user && (
                        <AddBtn onClick={() => setShowModal(true)}>+ Add Recurring Task</AddBtn>
                    )}
                </TodaySection>

                {!user && (
                    <Overlay>
                        <LockIcon>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </LockIcon>
                        <OverlayText>Log in to build your routine</OverlayText>
                        <OverlayButton onClick={() => navigate("/login")}>Login</OverlayButton>
                    </Overlay>
                )}
            </Card>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showModal && (
                    <Modal
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={e => e.target === e.currentTarget && setShowModal(false)}
                    >
                        <ModalBox
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >
                            <ModalTitle>Add Recurring Task</ModalTitle>

                            <FormGroup>
                                <label>Task Name</label>
                                <input
                                    placeholder="e.g. Morning Study, Evening Walk"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Category</label>
                                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                </select>
                            </FormGroup>

                            <FormGroup>
                                <label>Time of Day</label>
                                <select value={form.time_slot} onChange={e => setForm(f => ({ ...f, time_slot: e.target.value }))}>
                                    <option value="morning">Morning</option>
                                    <option value="afternoon">Afternoon</option>
                                    <option value="evening">Evening</option>
                                </select>
                            </FormGroup>

                            <FormGroup>
                                <label>Duration (minutes)</label>
                                <input
                                    type="number" min="15" step="15"
                                    value={form.duration_minutes}
                                    onChange={e => setForm(f => ({ ...f, duration_minutes: e.target.value }))}
                                />
                            </FormGroup>

                            <FormGroup>
                                <label>Repeat on Days</label>
                                <DayPicker>
                                    {DAYS.map((d, i) => (
                                        <DayToggle key={i} selected={form.days.includes(i)} onClick={() => toggleDay(i)}>
                                            {d}
                                        </DayToggle>
                                    ))}
                                </DayPicker>
                            </FormGroup>

                            <FormGroup>
                                <label>Colour</label>
                                <ColorPicker>
                                    {COLORS.map(c => (
                                        <ColorDot key={c} color={c} selected={form.color === c} onClick={() => setForm(f => ({ ...f, color: c }))} />
                                    ))}
                                </ColorPicker>
                            </FormGroup>

                            <ModalActions>
                                <CancelBtn onClick={() => setShowModal(false)}>Cancel</CancelBtn>
                                <SaveBtn onClick={saveTask} disabled={saving || !form.title.trim()}>
                                    {saving ? "Saving..." : "Add Task"}
                                </SaveBtn>
                            </ModalActions>
                        </ModalBox>
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
}
