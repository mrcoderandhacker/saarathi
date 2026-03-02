import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseDb as supabase, syncDbAuth } from "../../lib/supabase";

/* ─────────────────────── STYLES ─────────────────────── */
const Wrap = styled.div`
  background: ${p => p.panelBg};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const TabBar = styled.div`
  display: flex;
  background: rgba(0,0,0,0.25);
  border-bottom: 1px solid rgba(255,255,255,0.07);
`;

const Tab = styled.button`
  flex: 1;
  padding: 0.65rem 0.4rem;
  border: none;
  background: ${p => p.active ? 'rgba(255,255,255,0.08)' : 'transparent'};
  color: ${p => p.active ? 'white' : 'rgba(255,255,255,0.4)'};
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  cursor: pointer;
  border-bottom: 2px solid ${p => p.active ? p.accent : 'transparent'};
  transition: all 0.2s;
  &:hover { color: rgba(255,255,255,0.8); }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 999px; }
`;

/* ─── STATS ─── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const StatCard = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 0.75rem;
  .s-val { font-size: 1.4rem; font-weight: 800; color: ${p => p.accent}; line-height: 1; }
  .s-lbl { font-size: 0.65rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.07em; margin-top: 0.25rem; }
`;

const WeekRow = styled.div`
  display: flex;
  gap: 0.3rem;
  align-items: flex-end;
  height: 56px;
`;

const DayBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  .bar {
    width: 100%;
    border-radius: 4px 4px 0 0;
    background: ${p => p.active ? p.accent : 'rgba(255,255,255,0.08)'};
    height: ${p => Math.max(4, p.pct * 40)}px;
    transition: height 0.5s ease;
  }
  .lbl { font-size: 0.6rem; color: rgba(255,255,255,0.3); }
`;

/* ─── HISTORY ─── */
const HistoryItem = styled(motion.div)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); }
  
  .h-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; }
  .h-goal { font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.85); }
  .h-date { font-size: 0.65rem; color: rgba(255,255,255,0.35); }
  .h-stats { display: flex; gap: 0.75rem; }
  .h-stat { font-size: 0.7rem; color: rgba(255,255,255,0.45); }
  .h-stat span { color: ${p => p.accent}; font-weight: 700; }
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255,255,255,0.25);
  font-size: 0.8rem;
  padding: 2rem 1rem;
  line-height: 1.6;
`;

/* ─── TEMPLATES ─── */
const TemplateCard = styled(motion.div)`
  background: ${p => p.active ? `${p.accent}15` : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${p => p.active ? p.accent + '55' : 'rgba(255,255,255,0.07)'};
  border-radius: 12px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: ${p => p.accent}44; }

  .t-name { font-size: 0.82rem; font-weight: 700; color: white; margin-bottom: 0.25rem; }
  .t-meta { font-size: 0.68rem; color: rgba(255,255,255,0.4); line-height: 1.4; }
  .t-actions { display: flex; gap: 0.4rem; margin-top: 0.5rem; }
`;

const TinyBtn = styled(motion.button)`
  flex: 1;
  padding: 0.3rem;
  border-radius: 7px;
  border: none;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  background: ${p => p.primary ? p.accent : 'rgba(255,255,255,0.07)'};
  color: ${p => p.primary ? 'white' : 'rgba(255,255,255,0.6)'};
  transition: all 0.15s;
`;

const SaveForm = styled.form`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SmallInput = styled.input`
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 0.4rem 0.65rem;
  color: white;
  font-size: 0.78rem;
  outline: none;
  &::placeholder { color: rgba(255,255,255,0.25); }
  &:focus { border-color: ${p => p.accent}; }
`;

const SectionTitle = styled.div`
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: rgba(255,255,255,0.35);
`;

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function fmt(mins) {
    if (mins < 60) return `${mins}m`;
    return `${(mins / 60).toFixed(1)}h`;
}

function fmtDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function StudyHistory({ accent, panelBg, userId, currentSession, onLoadTemplate }) {
    const [tab, setTab] = useState('stats');
    const [sessions, setSessions] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [templateName, setTemplateName] = useState('');
    const [showSaveForm, setShowSaveForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) { setLoading(false); return; }
        const load = async () => {
            await syncDbAuth(); // Inject user JWT into supabaseDb so RLS passes
            const [{ data: s }, { data: t }] = await Promise.all([
                supabase.from('study_sessions').select('*').eq('user_id', userId).order('ended_at', { ascending: false }).limit(30),
                supabase.from('session_templates').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
            ]);
            setSessions(s || []);
            setTemplates(t || []);
            setLoading(false);
        };
        load();
    }, [userId]);

    // Aggregate stats
    const totalMins = sessions.reduce((a, s) => a + (s.focus_minutes || 0), 0);
    const totalPomodoros = sessions.reduce((a, s) => a + (s.pomodoros_completed || 0), 0);
    const thisWeek = sessions.filter(s => new Date(s.ended_at) > new Date(Date.now() - 7 * 24 * 3600 * 1000));
    const thisWeekMins = thisWeek.reduce((a, s) => a + (s.focus_minutes || 0), 0);

    // Bar chart: last 7 days
    const weekData = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        const dayStr = d.toDateString();
        const mins = sessions.filter(s => new Date(s.ended_at).toDateString() === dayStr).reduce((a, s) => a + s.focus_minutes, 0);
        return { day: DAYS[d.getDay()], mins, isToday: i === 6 };
    });
    const maxMins = Math.max(...weekData.map(d => d.mins), 1);

    const saveTemplate = async (e) => {
        e.preventDefault();
        if (!templateName.trim() || !userId) return;
        const record = {
            user_id: userId,
            name: templateName.trim(),
            goal: currentSession?.goal || '',
            tasks: currentSession?.tasks || [],
            youtube_url: currentSession?.youtubeUrl || '',
            theme: currentSession?.theme || 'midnight',
        };
        await syncDbAuth();
        const { data } = await supabase.from('session_templates').insert(record).select().single();
        if (data) setTemplates(prev => [data, ...prev]);
        setTemplateName('');
        setShowSaveForm(false);
    };

    const deleteTemplate = async (id) => {
        await syncDbAuth();
        await supabase.from('session_templates').delete().eq('id', id);
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    if (!userId) return (
        <Wrap panelBg={panelBg}>
            <Content><EmptyState>🔐 Log in to see your study history and save templates.</EmptyState></Content>
        </Wrap>
    );

    return (
        <Wrap panelBg={panelBg}>
            <TabBar>
                {['stats', 'history', 'templates'].map(t => (
                    <Tab key={t} active={tab === t} accent={accent} onClick={() => setTab(t)}>
                        {t === 'stats' ? '📊' : t === 'history' ? '🕐' : '📋'} {t}
                    </Tab>
                ))}
            </TabBar>

            <Content>
                {/* STATS TAB */}
                {tab === 'stats' && (
                    <>
                        <SectionTitle>All Time</SectionTitle>
                        <StatsGrid>
                            <StatCard accent={accent}><div className="s-val">{fmt(totalMins)}</div><div className="s-lbl">Total Focus</div></StatCard>
                            <StatCard accent={accent}><div className="s-val">🍅 {totalPomodoros}</div><div className="s-lbl">Pomodoros</div></StatCard>
                            <StatCard accent={accent}><div className="s-val">{sessions.length}</div><div className="s-lbl">Sessions</div></StatCard>
                            <StatCard accent={accent}><div className="s-val">{fmt(thisWeekMins)}</div><div className="s-lbl">This Week</div></StatCard>
                        </StatsGrid>

                        <SectionTitle>Last 7 Days</SectionTitle>
                        <WeekRow>
                            {weekData.map((d, i) => (
                                <DayBar key={i} pct={d.mins / maxMins} active={d.isToday || d.mins > 0} accent={accent}>
                                    <div className="bar" title={`${d.mins} min`} />
                                    <div className="lbl">{d.day}</div>
                                </DayBar>
                            ))}
                        </WeekRow>

                        {sessions.length === 0 && <EmptyState>No sessions yet.<br />Start a Pomodoro and end it to see your stats here!</EmptyState>}
                    </>
                )}

                {/* HISTORY TAB */}
                {tab === 'history' && (
                    <>
                        <SectionTitle>{sessions.length} Sessions</SectionTitle>
                        {sessions.length === 0 && <EmptyState>No past sessions yet.<br />Complete a session to see it here.</EmptyState>}
                        {sessions.map(s => (
                            <HistoryItem key={s.id} accent={accent} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="h-top">
                                    <div className="h-goal">{s.session_goal || 'Untitled Session'}</div>
                                    <div className="h-date">{fmtDate(s.ended_at)}</div>
                                </div>
                                <div className="h-stats">
                                    <div className="h-stat">⏱ <span>{fmt(s.focus_minutes)}</span></div>
                                    <div className="h-stat">🍅 <span>{s.pomodoros_completed}</span></div>
                                    <div className="h-stat">✅ <span>{s.tasks_completed}</span> tasks</div>
                                    <div className="h-stat">🎨 <span>{s.vibe_theme}</span></div>
                                </div>
                            </HistoryItem>
                        ))}
                    </>
                )}

                {/* TEMPLATES TAB */}
                {tab === 'templates' && (
                    <>
                        <TinyBtn
                            primary accent={accent}
                            onClick={() => setShowSaveForm(s => !s)}
                            whileTap={{ scale: 0.97 }}
                            style={{ width: '100%' }}
                        >
                            {showSaveForm ? '✕ Cancel' : '＋ Save Current Session as Template'}
                        </TinyBtn>

                        <AnimatePresence>
                            {showSaveForm && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                                    <SaveForm onSubmit={saveTemplate}>
                                        <SmallInput
                                            accent={accent}
                                            placeholder='Template name (e.g. "JEE Maths Sprint")'
                                            value={templateName}
                                            onChange={e => setTemplateName(e.target.value)}
                                        />
                                        <TinyBtn type="submit" primary accent={accent} whileTap={{ scale: 0.97 }}>Save Template</TinyBtn>
                                    </SaveForm>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <SectionTitle>{templates.length} Templates</SectionTitle>
                        {templates.length === 0 && <EmptyState>No templates yet.<br />Save your current session setup as a template to reuse it anytime!</EmptyState>}

                        {templates.map(t => (
                            <TemplateCard key={t.id} accent={accent} whileHover={{ scale: 1.01 }}>
                                <div className="t-name">{t.name}</div>
                                <div className="t-meta">
                                    {t.goal && `📍 ${t.goal}`}{t.goal && t.tasks?.length ? ' · ' : ''}
                                    {t.tasks?.length ? `${t.tasks.length} tasks` : ''}
                                    {t.youtube_url ? ' · 📺 Video saved' : ''}
                                </div>
                                <div className="t-actions">
                                    <TinyBtn primary accent={accent} onClick={() => onLoadTemplate?.(t)} whileTap={{ scale: 0.96 }}>
                                        ▶ Load
                                    </TinyBtn>
                                    <TinyBtn onClick={() => deleteTemplate(t.id)} whileTap={{ scale: 0.96 }}>
                                        🗑 Delete
                                    </TinyBtn>
                                </div>
                            </TemplateCard>
                        ))}
                    </>
                )}
            </Content>
        </Wrap>
    );
}
