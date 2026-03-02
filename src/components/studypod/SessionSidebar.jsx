import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Panel = styled.div`
  background: ${p => p.panelBg || 'rgba(255,255,255,0.06)'};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow-y: auto;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
`;

const GoalInput = styled.textarea`
  width: 100%;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 0.7rem;
  color: white;
  font-size: 0.82rem;
  resize: none;
  rows: 2;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.2s;
  &::placeholder { color: rgba(255,255,255,0.25); }
  &:focus { border-color: ${p => p.accent || '#6366f1'}; }
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const TaskItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.button`
  width: 18px; height: 18px;
  border-radius: 5px;
  border: 1.5px solid ${p => p.done ? p.accent : 'rgba(255,255,255,0.25)'};
  background: ${p => p.done ? p.accent : 'transparent'};
  flex-shrink: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  color: white;
  transition: all 0.15s;
`;

const TaskText = styled.span`
  font-size: 0.8rem;
  color: ${p => p.done ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.8)'};
  text-decoration: ${p => p.done ? 'line-through' : 'none'};
  flex: 1;
  line-height: 1.4;
`;

const DeleteBtn = styled.button`
  background: none; border: none;
  color: rgba(255,0,0,0.4);
  cursor: pointer; font-size: 0.75rem;
  padding: 0.1rem;
  opacity: 0;
  transition: opacity 0.15s;
  ${TaskItem}:hover & { opacity: 1; }
`;

const AddTaskRow = styled.form`
  display: flex;
  gap: 0.4rem;
`;

const AddInput = styled.input`
  flex: 1;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 0.45rem 0.7rem;
  color: white;
  font-size: 0.8rem;
  outline: none;
  &::placeholder { color: rgba(255,255,255,0.25); }
  &:focus { border-color: ${p => p.accent}; }
`;

const AddBtn = styled.button`
  background: ${p => p.accent};
  border: none;
  border-radius: 8px;
  padding: 0.45rem 0.8rem;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
`;

const NotesArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  background: rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 0.7rem;
  color: rgba(255,255,255,0.8);
  font-size: 0.78rem;
  resize: none;
  outline: none;
  font-family: inherit;
  line-height: 1.6;
  &::placeholder { color: rgba(255,255,255,0.2); }
  &:focus { border-color: rgba(255,255,255,0.15); }
`;

const SessionInfo = styled.div`
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoItem = styled.div`
  text-align: center;
  .val { font-size: 1.2rem; font-weight: 800; color: ${p => p.accent}; }
  .lbl { font-size: 0.6rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.1rem; }
`;

const EndBtn = styled(motion.button)`
  width: 100%;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, ${p => p.accent}, ${p => p.accent}cc);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: auto;
`;

function useElapsed(startTime) {
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m ${s}s`;
}

export default function SessionSidebar({ accent, panelBg, pomodoroCount, onEndSession }) {
    const [goal, setGoal] = useState('');
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState('');
    const [notes, setNotes] = useState(() => localStorage.getItem('saarathi_pod_notes') || '');
    const startTime = useRef(Date.now());
    const elapsed = useElapsed(startTime.current);

    useEffect(() => {
        localStorage.setItem('saarathi_pod_notes', notes);
    }, [notes]);

    const addTask = (e) => {
        e.preventDefault();
        if (!taskInput.trim()) return;
        setTasks(prev => [...prev, { id: Date.now(), text: taskInput.trim(), done: false }]);
        setTaskInput('');
    };

    const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

    const handleEnd = () => {
        onEndSession?.({
            goal,
            tasks,
            notes,
            elapsedDisplay: elapsed,
            elapsedSeconds: Math.floor((Date.now() - startTime.current) / 1000),
            pomodoroCount,
            tasksCompleted: tasks.filter(t => t.done).length,
        });
    };

    return (
        <Panel panelBg={panelBg}>
            {/* Session info */}
            <SessionInfo>
                <InfoItem accent={accent}>
                    <div className="val">{elapsed}</div>
                    <div className="lbl">Elapsed</div>
                </InfoItem>
                <InfoItem accent={accent}>
                    <div className="val">🍅 {pomodoroCount}</div>
                    <div className="lbl">Pomodoros</div>
                </InfoItem>
                <InfoItem accent={accent}>
                    <div className="val">{tasks.filter(t => t.done).length}/{tasks.length}</div>
                    <div className="lbl">Tasks Done</div>
                </InfoItem>
            </SessionInfo>

            {/* Session goal */}
            <div>
                <SectionTitle style={{ marginBottom: '0.5rem' }}>🎯 Session Goal</SectionTitle>
                <GoalInput
                    accent={accent}
                    rows={2}
                    placeholder="What do you want to accomplish this session?"
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                />
            </div>

            {/* Tasks */}
            <div>
                <SectionTitle style={{ marginBottom: '0.5rem' }}>✅ Tasks</SectionTitle>
                <TaskList>
                    <AnimatePresence>
                        {tasks.map(t => (
                            <TaskItem key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                <Checkbox done={t.done} accent={accent} onClick={() => toggleTask(t.id)}>
                                    {t.done && '✓'}
                                </Checkbox>
                                <TaskText done={t.done}>{t.text}</TaskText>
                                <DeleteBtn onClick={() => deleteTask(t.id)}>✕</DeleteBtn>
                            </TaskItem>
                        ))}
                    </AnimatePresence>
                </TaskList>
                <AddTaskRow onSubmit={addTask} style={{ marginTop: tasks.length ? '0.5rem' : 0 }}>
                    <AddInput accent={accent} placeholder="Add a task..." value={taskInput} onChange={e => setTaskInput(e.target.value)} />
                    <AddBtn type="submit" accent={accent}>+</AddBtn>
                </AddTaskRow>
            </div>

            {/* Notes */}
            <div>
                <SectionTitle style={{ marginBottom: '0.5rem' }}>📝 Notes</SectionTitle>
                <NotesArea
                    placeholder="Jot down quick notes, formulas, or ideas..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={5}
                />
            </div>

            <EndBtn accent={accent} onClick={handleEnd} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                🏁 End Session
            </EndBtn>
        </Panel>
    );
}
