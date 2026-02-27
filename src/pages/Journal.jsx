import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

/* ---- STYLES ---- */
const Layout = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
  padding-top: 80px;
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 1.9rem;
  color: #0f172a;
  margin: 0 0 0.2rem;
`;

const PageSub = styled(motion.p)`
  color: #64748b;
  font-size: 0.88rem;
  margin: 0;
`;

const NewBtn = styled.button`
  background: #111827;
  color: white;
  border: none;
  padding: 0.6rem 1.3rem;
  border-radius: 999px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover { background: #1f2937; }
`;

const MoodBar = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`;

const MoodChip = styled.button`
  background: ${p => p.selected ? '#ede9fe' : 'white'};
  border: 1.5px solid ${p => p.selected ? '#6366f1' : '#e2e8f0'};
  color: ${p => p.selected ? '#4f46e5' : '#6b7280'};
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #6366f1; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const EntryCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.2rem;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${p => MOOD_COLORS[p.mood] || '#6366f1'};
  }
`;

const EntryDate = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
`;

const EntryMood = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: ${p => MOOD_COLORS[p.mood] || '#6366f1'};
  background: ${p => MOOD_COLORS[p.mood] || '#6366f1'}18;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: inline-block;
`;

const EntryTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin: 0.4rem 0 0.3rem;
  line-height: 1.3;
`;

const EntryPreview = styled.p`
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #9ca3af;
`;

const EmptyEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
`;

/* ---- MODAL ---- */
const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;

  @media (min-width: 640px) {
    align-items: center;
    padding: 1rem;
  }
`;

const ModalBox = styled(motion.div)`
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 1.5rem;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;

  @media (min-width: 640px) {
    border-radius: 20px;
    max-width: 580px;
    max-height: 85vh;
  }
`;

const ModalHandle = styled.div`
  width: 40px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 999px;
  margin: 0 auto 1.2rem;

  @media (min-width: 640px) {
    display: none;
  }
`;

const ModalTitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.3rem;
  color: #111827;
  margin-bottom: 1.2rem;
`;

const FormField = styled.div`
  margin-bottom: 0.9rem;
  label { display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: #6366f1; }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  resize: vertical;
  min-height: 160px;
  font-family: inherit;
  line-height: 1.6;
  &:focus { border-color: #6366f1; }
`;

const MoodSelector = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const MoodOption = styled.button`
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  border: 1.5px solid ${p => p.selected ? MOOD_COLORS[p.mood] : '#e2e8f0'};
  background: ${p => p.selected ? MOOD_COLORS[p.mood] + '20' : 'transparent'};
  color: ${p => p.selected ? MOOD_COLORS[p.mood] : '#6b7280'};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 0.7rem;
  margin-top: 1.2rem;
  justify-content: flex-end;
`;

const CancelBtn = styled.button`
  background: #f1f5f9; border: none; padding: 0.6rem 1.2rem;
  border-radius: 8px; font-size: 0.9rem; cursor: pointer; color: #64748b;
  &:hover { background: #e2e8f0; }
`;

const SaveEntryBtn = styled.button`
  background: #111827; color: white; border: none; padding: 0.6rem 1.5rem;
  border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  &:hover { background: #1f2937; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const DeleteBtn = styled.button`
  background: transparent; border: none; color: #dc2626; font-size: 0.82rem;
  cursor: pointer; padding: 0; margin-right: auto;
  &:hover { text-decoration: underline; }
`;

const Overlay = styled.div`
  position: absolute; top:0; left:0; right:0; bottom:0;
  background: rgba(255,255,255,0.7); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; text-align: center; border-radius: 20px;
`;

const MOODS = ["😊 Great", "🙂 Good", "😐 Okay", "😔 Tired", "😤 Stressed"];
const MOOD_COLORS = {
  "😊 Great": "#10b981",
  "🙂 Good": "#6366f1",
  "😐 Okay": "#f59e0b",
  "😔 Tired": "#3b82f6",
  "😤 Stressed": "#ef4444"
};
const MOOD_FILTERS = ["All", ...MOODS];

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export default function Journal() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMood, setFilterMood] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ title: "", content: "", mood: "😊 Great" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/login"); return; }
    setUser(session.user);
    await fetchEntries(session.user.id);
    setLoading(false);
  };

  const fetchEntries = async (uid) => {
    const { data } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setEntries(data || []);
  };

  const openNew = () => {
    setEditEntry(null);
    setForm({ title: "", content: "", mood: "😊 Great" });
    setShowModal(true);
  };

  const openEdit = (entry) => {
    setEditEntry(entry);
    setForm({ title: entry.title, content: entry.content, mood: entry.mood });
    setShowModal(true);
  };

  const saveEntry = async () => {
    if (!form.content.trim()) return;
    setSaving(true);
    try {
      // Ensure profile exists
      await supabase.from("profiles").upsert({ id: user.id }, { onConflict: "id" });

      if (editEntry) {
        const { data, error } = await supabase.from("journal_entries")
          .update({ title: form.title, content: form.content, mood: form.mood })
          .eq("id", editEntry.id).select().single();
        if (error) throw error;
        setEntries(prev => prev.map(e => e.id === editEntry.id ? data : e));
      } else {
        const { data, error } = await supabase.from("journal_entries")
          .insert({ user_id: user.id, title: form.title, content: form.content, mood: form.mood })
          .select().single();
        if (error) throw error;
        setEntries(prev => [data, ...prev]);
      }
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async () => {
    if (!editEntry) return;
    await supabase.from("journal_entries").delete().eq("id", editEntry.id);
    setEntries(prev => prev.filter(e => e.id !== editEntry.id));
    setShowModal(false);
  };

  const filtered = filterMood === "All" ? entries : entries.filter(e => e.mood === filterMood);

  if (loading) return <Layout><Navbar /></Layout>;

  return (
    <Layout>
      <Navbar />
      <Container>
        <PageHeader>
          <div>
            <PageTitle initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              My Journal
            </PageTitle>
            <PageSub initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              {entries.length} {entries.length === 1 ? "entry" : "entries"} · Write freely, reflect often.
            </PageSub>
          </div>
          <NewBtn onClick={openNew}>+ New Entry</NewBtn>
        </PageHeader>

        {/* Mood filter */}
        <MoodBar>
          {MOOD_FILTERS.map(m => (
            <MoodChip key={m} selected={filterMood === m} onClick={() => setFilterMood(m)}>
              {m}
            </MoodChip>
          ))}
        </MoodBar>

        {filtered.length === 0 ? (
          <EmptyState>
            <EmptyTitle>{filterMood === "All" ? "No entries yet" : `No ${filterMood} entries`}</EmptyTitle>
            <p style={{ fontSize: "0.85rem" }}>
              {filterMood === "All" ? "Start writing — even one line a day makes a difference." : "Try a different mood filter."}
            </p>
          </EmptyState>
        ) : (
          <Grid>
            {filtered.map((entry, i) => (
              <EntryCard
                key={entry.id}
                mood={entry.mood}
                onClick={() => openEdit(entry)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <EntryDate>{formatDate(entry.created_at)}</EntryDate>
                <EntryMood mood={entry.mood}>{entry.mood}</EntryMood>
                {entry.title && <EntryTitle>{entry.title}</EntryTitle>}
                <EntryPreview>{entry.content}</EntryPreview>
              </EntryCard>
            ))}
          </Grid>
        )}
      </Container>

      {/* Entry Modal */}
      <AnimatePresence>
        {showModal && (
          <Backdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={e => e.target === e.currentTarget && setShowModal(false)}
          >
            <ModalBox
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ModalHandle />
              <ModalTitle>{editEntry ? "Edit Entry" : "New Journal Entry"}</ModalTitle>

              <FormField>
                <label>How are you feeling?</label>
                <MoodSelector>
                  {MOODS.map(m => (
                    <MoodOption key={m} mood={m} selected={form.mood === m} onClick={() => setForm(f => ({ ...f, mood: m }))}>
                      {m}
                    </MoodOption>
                  ))}
                </MoodSelector>
              </FormField>

              <FormField>
                <label>Title (optional)</label>
                <TextInput
                  placeholder="e.g. Thoughts after practice test..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
              </FormField>

              <FormField>
                <label>What's on your mind? *</label>
                <TextArea
                  placeholder="Write anything — what happened today, how you're feeling, what you're thinking about..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                />
              </FormField>

              <ModalActions>
                {editEntry && (
                  <DeleteBtn onClick={deleteEntry}>Delete</DeleteBtn>
                )}
                <CancelBtn onClick={() => setShowModal(false)}>Cancel</CancelBtn>
                <SaveEntryBtn onClick={saveEntry} disabled={saving || !form.content.trim()}>
                  {saving ? "Saving..." : editEntry ? "Update" : "Save Entry"}
                </SaveEntryBtn>
              </ModalActions>
            </ModalBox>
          </Backdrop>
        )}
      </AnimatePresence>
    </Layout>
  );
}
