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
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
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

const AddBtn = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #1f2937; }
`;

const GoalCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid ${p => CATEGORY_COLORS[p.category] || '#6366f1'};

  &:hover { background: #f8fafc; transform: translateX(2px); }
`;

const GoalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.6rem;
`;

const GoalTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
  flex: 1;
`;

const GoalMeta = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
`;

const CategoryBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  background: ${p => CATEGORY_COLORS[p.cat]}22;
  color: ${p => CATEGORY_COLORS[p.cat]};
`;

const DateChip = styled.span`
  font-size: 0.72rem;
  color: #9ca3af;
  border: 1px solid #f1f5f9;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
`;

const ProgressBar = styled.div`
  height: 5px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 0.6rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: ${p => CATEGORY_COLORS[p.$category] || '#6366f1'};
  width: ${p => p.$pct}%;
  transition: width 0.5s ease;
`;

const ProgressText = styled.div`
  font-size: 0.72rem;
  color: #9ca3af;
  margin-top: 0.3rem;
  text-align: right;
`;

const MilestoneList = styled.div`
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const MilestoneRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: ${p => p.$done ? '#9ca3af' : '#374151'};
  text-decoration: ${p => p.$done ? 'line-through' : 'none'};
  cursor: pointer;
  padding: 0.3rem 0;
  &:hover { color: #111827; }
`;

const MCCheck = styled.div`
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid ${p => p.$done ? CATEGORY_COLORS[p.$cat] : '#cbd5e1'};
  background: ${p => p.$done ? CATEGORY_COLORS[p.$cat] : 'transparent'};
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
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
  p { font-size: 0.8rem; max-width: 240px; line-height: 1.4; margin: 0;}
`;

const Modal = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(0,0,0,0.5);
  z-index: 500; display: flex; align-items: center; justify-content: center; padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: white; border-radius: 20px; padding: 2rem;
  width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 1.2rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label { display: block; font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.4rem; }
  input, select, textarea {
    width: 100%; padding: 0.6rem 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px;
    font-size: 0.9rem; outline: none; box-sizing: border-box; font-family: inherit;
    &:focus { border-color: #6366f1; }
    resize: none;
  }
`;

const MilestoneInputRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const MilestoneInput = styled.input`
  flex: 1; padding: 0.5rem 0.8rem; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 0.85rem; outline: none;
  &:focus { border-color: #6366f1; }
`;

const AddMilestoneBtn = styled.button`
  background: #f1f5f9; border: none; padding: 0.5rem 0.8rem;
  border-radius: 8px; font-size: 0.85rem; cursor: pointer; color: #6366f1; font-weight: 600;
  white-space: nowrap;
  &:hover { background: #e0e7ff; }
`;

const MChip = styled.div`
  display: flex; align-items: center; gap: 0.5rem;
  background: #f8fafc; border-radius: 8px; padding: 0.4rem 0.8rem;
  font-size: 0.82rem; color: #374151; margin-bottom: 0.4rem;
`;

const RemoveMBtn = styled.button`
  background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1rem; padding: 0;
  &:hover { color: #ef4444; }
`;

const ModalActions = styled.div`
  display: flex; gap: 0.8rem; margin-top: 1.5rem; justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background: #f1f5f9; border: none; padding: 0.6rem 1.2rem;
  border-radius: 8px; font-size: 0.9rem; cursor: pointer; color: #64748b;
  &:hover { background: #e2e8f0; }
`;

const SaveBtn = styled.button`
  background: #111827; color: white; border: none; padding: 0.6rem 1.5rem;
  border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  &:hover { background: #1f2937; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
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

const CATEGORY_COLORS = {
  academic: '#6366f1',
  passion: '#ec4899',
  health: '#10b981',
  social: '#f59e0b',
  other: '#64748b'
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

export default function GoalTracker({ user }) {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form
  const [form, setForm] = useState({
    title: "", description: "", category: "academic", target_date: "", milestones: []
  });
  const [mInput, setMInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (user) fetchGoals();
    else setLoading(false);
  }, [user]);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });
      const { data } = await supabase.from("goals").select("*").eq("user_id", user.id).order("created_at");
      setGoals(data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const saveGoal = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const { data, error } = await supabase.from("goals").insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        category: form.category,
        target_date: form.target_date || null,
        milestones: form.milestones.map(m => ({ title: m, done: false }))
      }).select().single();
      if (error) throw error;
      setGoals(prev => [...prev, data]);
      setShowModal(false);
      setForm({ title: "", description: "", category: "academic", target_date: "", milestones: [] });
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const toggleMilestone = async (goal, mIdx) => {
    const updated = [...(goal.milestones || [])];
    updated[mIdx] = { ...updated[mIdx], done: !updated[mIdx].done };
    await supabase.from("goals").update({ milestones: updated }).eq("id", goal.id);
    setGoals(prev => prev.map(g => g.id === goal.id ? { ...g, milestones: updated } : g));
  };

  const addMilestone = () => {
    if (!mInput.trim()) return;
    setForm(f => ({ ...f, milestones: [...f.milestones, mInput.trim()] }));
    setMInput("");
  };

  const generateAI = async () => {
    if (!form.title.trim()) {
      alert("Please enter a Goal Title first!");
      return;
    }
    setIsGenerating(true);
    try {
      // In production, configure API base URL properly. Defaulting to local backend port 4000.
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
      const res = await fetch(`${baseUrl}/api/ai/generate-roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, goal: form.title, durationMonths: 6 })
      });
      if (!res.ok) throw new Error("Failed to generate AI Roadmap");
      const data = await res.json();

      const newMilestones = data.curriculum.map(m => `Month ${m.month}: ${m.focus} - ${m.topics.join(', ')}`);
      setForm(f => ({ ...f, milestones: newMilestones }));
    } catch (e) {
      console.error(e);
      alert("Failed to connect to AI Engine. Make sure backend is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getMilestonePct = (goal) => {
    const ms = goal.milestones || [];
    if (!ms.length) return 0;
    return Math.round((ms.filter(m => m.done).length / ms.length) * 100);
  };

  const deleteGoal = async (goalId) => {
    await supabase.from("goals").delete().eq("id", goalId);
    setGoals(prev => prev.filter(g => g.id !== goalId));
    setExpandedId(null);
  };

  return (
    <>
      <Card initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Header>
          <Title>
            <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" width="20" height="20">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            Long-Term Goals
          </Title>
          {user && <AddBtn onClick={() => setShowModal(true)}>+ New Goal</AddBtn>}
        </Header>

        {loading ? (
          <GeneralWidgetSkeleton />
        ) : goals.length === 0 ? (
          <EmptyStateGraphic
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <h4>No goals yet</h4>
            <p>Add your first long-term goal and break it into milestones you can achieve.</p>
          </EmptyStateGraphic>
        ) : (
          goals.map(goal => {
            const pct = getMilestonePct(goal);
            const isExpanded = expandedId === goal.id;
            return (
              <GoalCard key={goal.id} category={goal.category} onClick={() => setExpandedId(isExpanded ? null : goal.id)}>
                <GoalHeader>
                  <GoalTitle>{goal.title}</GoalTitle>
                  <GoalMeta>
                    <CategoryBadge cat={goal.category}>{goal.category}</CategoryBadge>
                    {goal.target_date && <DateChip>{formatDate(goal.target_date)}</DateChip>}
                  </GoalMeta>
                </GoalHeader>

                {goal.description && (
                  <p style={{ fontSize: "0.82rem", color: "#6b7280", margin: "0 0 0.5rem" }}>{goal.description}</p>
                )}

                {(goal.milestones || []).length > 0 && (
                  <>
                    <ProgressBar>
                      <ProgressFill $pct={pct} $category={goal.category} />
                    </ProgressBar>
                    <ProgressText>{pct}% complete · {(goal.milestones || []).filter(m => m.done).length}/{(goal.milestones || []).length} milestones</ProgressText>
                  </>
                )}

                <AnimatePresence>
                  {isExpanded && (goal.milestones || []).length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <MilestoneList onClick={e => e.stopPropagation()}>
                        {(goal.milestones || []).map((m, i) => (
                          <MilestoneRow key={i} $done={m.done} onClick={() => toggleMilestone(goal, i)}>
                            <MCCheck $done={m.done} $cat={goal.category}>
                              {m.done && (
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </MCCheck>
                            {m.title}
                          </MilestoneRow>
                        ))}
                      </MilestoneList>
                    </motion.div>
                  )}
                </AnimatePresence>

                {isExpanded && (
                  <div
                    onClick={e => e.stopPropagation()}
                    style={{ marginTop: "0.8rem", textAlign: "right" }}
                  >
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      style={{
                        background: "transparent", border: "none",
                        color: "#dc2626", fontSize: "0.78rem", cursor: "pointer",
                        padding: "0.2rem 0"
                      }}
                    >
                      Delete goal
                    </button>
                  </div>
                )}
              </GoalCard>
            );
          })
        )}

        {!user && (
          <Overlay>
            <LockIcon>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </LockIcon>
            <OverlayText>Log in to set your goals</OverlayText>
            <OverlayButton onClick={() => navigate("/login")}>Login</OverlayButton>
          </Overlay>
        )}
      </Card>

      {/* Add Goal Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <ModalBox initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <ModalTitle>New Long-Term Goal</ModalTitle>

              <FormGroup>
                <label>Goal Title *</label>
                <input placeholder="e.g. Crack JEE Advanced, Learn Guitar"
                  value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </FormGroup>

              <FormGroup>
                <label>Description (optional)</label>
                <textarea rows={2} placeholder="Why is this goal important to you?"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </FormGroup>

              <FormGroup>
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Target Date (optional)</label>
                <input type="date" value={form.target_date}
                  onChange={e => setForm(f => ({ ...f, target_date: e.target.value }))} />
              </FormGroup>

              <FormGroup>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label style={{ margin: 0 }}>Milestones (optional — break it down)</label>
                  <button
                    onClick={generateAI}
                    disabled={isGenerating || !form.title.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
                      color: 'white', border: 'none', padding: '0.4rem 0.8rem',
                      borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer',
                      opacity: isGenerating ? 0.7 : 1
                    }}
                  >
                    {isGenerating ? "✨ Generating..." : "✨ Auto-Generate with AI"}
                  </button>
                </div>
                <MilestoneInputRow>
                  <MilestoneInput placeholder="e.g. Complete Physics syllabus"
                    value={mInput} onChange={e => setMInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addMilestone()} />
                  <AddMilestoneBtn onClick={addMilestone}>+ Add</AddMilestoneBtn>
                </MilestoneInputRow>
                {form.milestones.map((m, i) => (
                  <MChip key={i}>
                    <span style={{ flex: 1 }}>{m}</span>
                    <RemoveMBtn onClick={() => setForm(f => ({ ...f, milestones: f.milestones.filter((_, j) => j !== i) }))}>×</RemoveMBtn>
                  </MChip>
                ))}
              </FormGroup>

              <ModalActions>
                <CancelBtn onClick={() => setShowModal(false)}>Cancel</CancelBtn>
                <SaveBtn onClick={saveGoal} disabled={saving || !form.title.trim()}>
                  {saving ? "Saving..." : "Create Goal"}
                </SaveBtn>
              </ModalActions>
            </ModalBox>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
