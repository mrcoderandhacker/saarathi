import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
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
  max-width: 760px;
  margin: 0 auto;
  padding: 2rem 1.2rem;
`;

const PageTitle = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 1.9rem;
  color: #0f172a;
  margin-bottom: 0.3rem;
`;

const PageSub = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 2rem;
`;

const AvatarSection = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const AvatarInfo = styled.div`
  flex: 1;
`;

const AvatarName = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.2rem;
`;

const AvatarEmail = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 0.4rem;
`;

const LifeScoreBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
`;

const Section = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
`;

const SectionTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 1.2rem;
`;

const Field = styled.div`
  margin-bottom: 1rem;
  &:last-child { margin-bottom: 0; }
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.4rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid ${p => p.disabled ? '#f1f5f9' : '#e2e8f0'};
  border-radius: 10px;
  font-size: 0.9rem;
  background: ${p => p.disabled ? '#f8fafc' : 'white'};
  color: ${p => p.disabled ? '#9ca3af' : '#111827'};
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
  &:focus { border-color: #6366f1; }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  background: white;
  color: #111827;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: #6366f1; }
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Chip = styled.button`
  border: 1.5px solid ${p => p.selected ? '#6366f1' : '#e2e8f0'};
  background: ${p => p.selected ? '#ede9fe' : 'transparent'};
  color: ${p => p.selected ? '#4f46e5' : '#6b7280'};
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  &:hover { border-color: #6366f1; color: #4f46e5; }
`;

const SaveBtn = styled.button`
  width: 100%;
  background: #111827;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 0.5rem;
  &:hover { background: #1f2937; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 1000;
  white-space: nowrap;
`;

const DangerBtn = styled.button`
  background: transparent;
  border: 1.5px solid #fca5a5;
  color: #dc2626;
  padding: 0.65rem 1.2rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #fef2f2; }
`;

const INTERESTS = [
    "Music", "Sports", "Art", "Coding", "Reading",
    "Film", "Cooking", "Travel", "Dance", "Gaming",
    "Photography", "Writing", "Theatre", "Yoga", "Nature"
];

const STAGES = ["Class 10", "Class 11", "Class 12", "Drop Year", "Graduate"];
const EXAMS = ["JEE", "NEET", "CET", "CUET", "CLAT", "CA", "Other", "Not sure yet"];

export default function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [lifeScore, setLifeScore] = useState(0);

    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        stage: "",
        exam: "",
        interests: []
    });

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate("/login"); return; }

        const usr = session.user;
        setUser(usr);

        // Load profile
        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", usr.id)
            .maybeSingle();

        if (profile) {
            setForm({
                full_name: profile.full_name || usr.user_metadata?.full_name || "",
                phone: profile.phone || "",
                stage: profile.stage || "",
                exam: profile.exam_target || "",
                interests: profile.interests || []
            });
            setLifeScore(profile.life_score || 0);
        } else {
            setForm(f => ({ ...f, full_name: usr.user_metadata?.full_name || "" }));
        }

        // Compute life score from task completions this week
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 6);
        const { count } = await supabase
            .from("task_completions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", usr.id)
            .gte("completed_date", weekStart.toISOString().split("T")[0]);
        setLifeScore(Math.min((count || 0) * 5, 100));

        setLoading(false);
    };

    const saveProfile = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    full_name: form.full_name,
                    phone: form.phone,
                    stage: form.stage,
                    exam_target: form.exam,
                    interests: form.interests
                }, { onConflict: "id" });

            if (error) throw error;

            // Also update auth metadata name
            if (form.full_name) {
                await supabase.auth.updateUser({ data: { full_name: form.full_name } });
            }

            showToast("Profile saved");
        } catch (e) {
            console.error(e);
            showToast("Error saving profile — please try again");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const toggleInterest = (i) => {
        setForm(f => ({
            ...f,
            interests: f.interests.includes(i) ? f.interests.filter(x => x !== i) : [...f.interests, i]
        }));
    };

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const initial = (form.full_name || user?.email || "U").charAt(0).toUpperCase();
    const SCORE_LABELS = ["Beginner", "Explorer", "Consistent", "Dedicated", "Champion"];
    const level = SCORE_LABELS[Math.min(Math.floor(lifeScore / 20), 4)];

    if (loading) return <Layout><Navbar /></Layout>;

    return (
        <Layout>
            <Navbar />
            <Container>
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <PageTitle>My Profile</PageTitle>
                    <PageSub>Manage your account and personalise your Saarathi experience.</PageSub>
                </motion.div>

                {/* Avatar card */}
                <AvatarSection initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Avatar>{initial}</Avatar>
                    <AvatarInfo>
                        <AvatarName>{form.full_name || "Your Name"}</AvatarName>
                        <AvatarEmail>{user?.email}</AvatarEmail>
                        <LifeScoreBadge>Life Score: {lifeScore}/100 · {level}</LifeScoreBadge>
                    </AvatarInfo>
                </AvatarSection>

                {/* Basic Info */}
                <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <SectionTitle>Basic Info</SectionTitle>

                    <Field>
                        <Label>Full Name</Label>
                        <Input
                            value={form.full_name}
                            onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                            placeholder="Your full name"
                        />
                    </Field>

                    <Field>
                        <Label>Email (cannot change)</Label>
                        <Input value={user?.email || ""} disabled />
                    </Field>

                    <Field>
                        <Label>Phone Number</Label>
                        <Input
                            value={form.phone}
                            onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                        />
                    </Field>
                </Section>

                {/* Academic Info */}
                <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <SectionTitle>Academic Profile</SectionTitle>

                    <Field>
                        <Label>Current Stage</Label>
                        <Select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
                            <option value="">Select your stage</option>
                            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                    </Field>

                    <Field>
                        <Label>Target Exam</Label>
                        <Select value={form.exam} onChange={e => setForm(f => ({ ...f, exam: e.target.value }))}>
                            <option value="">Select your exam</option>
                            {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                        </Select>
                    </Field>
                </Section>

                {/* Interests */}
                <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <SectionTitle>Interests & Passions</SectionTitle>
                    <ChipRow>
                        {INTERESTS.map(i => (
                            <Chip key={i} selected={form.interests.includes(i)} onClick={() => toggleInterest(i)}>
                                {i}
                            </Chip>
                        ))}
                    </ChipRow>
                </Section>

                {/* Save */}
                <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <SaveBtn onClick={saveProfile} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </SaveBtn>
                </Section>

                {/* Danger Zone */}
                <Section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <SectionTitle>Account</SectionTitle>
                    <DangerBtn onClick={handleLogout}>Log Out</DangerBtn>
                </Section>
            </Container>

            {/* Toast */}
            {toast && (
                <Toast
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                >
                    {toast}
                </Toast>
            )}
        </Layout>
    );
}
