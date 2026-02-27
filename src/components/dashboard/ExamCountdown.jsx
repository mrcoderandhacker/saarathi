import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

/* ---- STYLES ---- */
const Pill = styled(motion.div)`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 0.9rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: ${p => p.clickable ? 'pointer' : 'default'};
  transition: box-shadow 0.2s;
  min-width: 200px;

  &:hover {
    box-shadow: ${p => p.clickable ? '0 4px 12px rgba(0,0,0,0.08)' : 'none'};
  }
`;

const CountBubble = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${p => p.urgent ? '#fef2f2' : p.soon ? '#fffbeb' : '#ede9fe'};
  color: ${p => p.urgent ? '#dc2626' : p.soon ? '#d97706' : '#7c3aed'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CountNum = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
`;

const CountUnit = styled.div`
  font-size: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
`;

const Info = styled.div``;

const ExamName = styled.div`
  font-size: 0.88rem;
  font-weight: 700;
  color: #111827;
`;

const ExamDate = styled.div`
  font-size: 0.72rem;
  color: #9ca3af;
  margin-top: 0.1rem;
`;

const SetupText = styled.div`
  font-size: 0.82rem;
  color: #9ca3af;
`;
const SetupSub = styled.div`
  font-size: 0.72rem;
  color: #cbd5e1;
`;

/* Modal */
const Backdrop = styled(motion.div)`
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.5);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
`;

const ModalBox = styled(motion.div)`
  background: white; border-radius: 20px; padding: 1.8rem;
  width: 100%; max-width: 400px;
`;

const ModalTitle = styled.h3`
  font-size: 1.1rem; font-weight: 700; color: #111827; margin-bottom: 1.2rem;
`;

const Label = styled.label`
  display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem;
`;

const Select = styled.select`
  width: 100%; padding: 0.65rem 0.9rem; border: 1px solid #e2e8f0;
  border-radius: 10px; font-size: 0.9rem; outline: none; margin-bottom: 1rem;
  box-sizing: border-box;
  &:focus { border-color: #6366f1; }
`;

const DateInput = styled.input`
  width: 100%; padding: 0.65rem 0.9rem; border: 1px solid #e2e8f0;
  border-radius: 10px; font-size: 0.9rem; outline: none; margin-bottom: 1.2rem;
  box-sizing: border-box;
  &:focus { border-color: #6366f1; }
`;

const SaveBtn = styled.button`
  width: 100%; background: #111827; color: white; border: none;
  padding: 0.75rem; border-radius: 10px; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  &:hover { background: #1f2937; }
`;

const EXAMS = ["JEE Main", "JEE Advanced", "NEET", "CET (MHT)", "CUET", "CLAT", "BITSAT", "Other"];

const daysUntil = (dateStr) => {
    const target = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function ExamCountdown({ user }) {
    const [exam, setExam] = useState(null); // { exam_name, exam_date }
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ exam_name: "JEE Main", exam_date: "" });
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (user) fetchExam();
        else setLoaded(true);
    }, [user]);

    const fetchExam = async () => {
        const { data: profile } = await supabase
            .from("profiles")
            .select("exam_name, exam_date")
            .eq("id", user.id)
            .maybeSingle();
        if (profile?.exam_date) setExam({ exam_name: profile.exam_name, exam_date: profile.exam_date });
        setLoaded(true);
    };

    const saveExam = async () => {
        if (!form.exam_date) return;
        await supabase.from("profiles").upsert(
            { id: user.id, exam_name: form.exam_name, exam_date: form.exam_date },
            { onConflict: "id" }
        );
        setExam(form);
        setShowModal(false);
    };

    if (!user || !loaded) return null;

    if (!exam) {
        return (
            <>
                <Pill
                    clickable
                    onClick={() => setShowModal(true)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                >
                    <CountBubble>
                        <span style={{ fontSize: "1.3rem" }}>📅</span>
                    </CountBubble>
                    <Info>
                        <SetupText>Set your exam</SetupText>
                        <SetupSub>Track your countdown</SetupSub>
                    </Info>
                </Pill>

                <AnimatePresence>
                    {showModal && (
                        <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                            <ModalBox initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                                <ModalTitle>⏱️ Set Your Exam Countdown</ModalTitle>
                                <Label>Which exam?</Label>
                                <Select value={form.exam_name} onChange={e => setForm(f => ({ ...f, exam_name: e.target.value }))}>
                                    {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                                </Select>
                                <Label>Exam date</Label>
                                <DateInput type="date" value={form.exam_date} onChange={e => setForm(f => ({ ...f, exam_date: e.target.value }))} />
                                <SaveBtn onClick={saveExam}>Start Countdown</SaveBtn>
                            </ModalBox>
                        </Backdrop>
                    )}
                </AnimatePresence>
            </>
        );
    }

    const days = daysUntil(exam.exam_date);
    const urgent = days <= 30;
    const soon = days <= 90;

    return (
        <>
            <Pill
                clickable
                onClick={() => setShowModal(true)}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
            >
                <CountBubble urgent={urgent} soon={!urgent && soon}>
                    <CountNum>{days > 0 ? days : "🎉"}</CountNum>
                    {days > 0 && <CountUnit>days</CountUnit>}
                </CountBubble>
                <Info>
                    <ExamName>{exam.exam_name}</ExamName>
                    <ExamDate>{days > 0 ? formatDate(exam.exam_date) : "Exam day!"}</ExamDate>
                </Info>
            </Pill>

            <AnimatePresence>
                {showModal && (
                    <Backdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={e => e.target === e.currentTarget && setShowModal(false)}>
                        <ModalBox initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
                            <ModalTitle>⏱️ Update Exam Countdown</ModalTitle>
                            <Label>Which exam?</Label>
                            <Select value={form.exam_name || exam.exam_name}
                                onChange={e => setForm(f => ({ ...f, exam_name: e.target.value }))}>
                                {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                            </Select>
                            <Label>Exam date</Label>
                            <DateInput type="date" value={form.exam_date || exam.exam_date}
                                onChange={e => setForm(f => ({ ...f, exam_date: e.target.value }))} />
                            <SaveBtn onClick={saveExam}>Update Countdown</SaveBtn>
                        </ModalBox>
                    </Backdrop>
                )}
            </AnimatePresence>
        </>
    );
}
