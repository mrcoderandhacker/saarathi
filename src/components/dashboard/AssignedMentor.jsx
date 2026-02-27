import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

/* ---- STYLES ---- */
const Card = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  border: 1px solid rgba(0,0,0,0.05);
  position: relative;
`;

/* Gradient top strip */
const GoldStrip = styled.div`
  height: 5px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24, #f59e0b);
  background-size: 200% auto;
  animation: shine 2s linear infinite;

  @keyframes shine {
    to { background-position: 200% center; }
  }
`;

const Body = styled.div`
  padding: 1.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
`;

const TitleGroup = styled.div``;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin: 0 0 0.15rem;
`;

const CardSub = styled.p`
  font-size: 0.75rem;
  color: #9ca3af;
  margin: 0;
`;

const GoldBadge = styled.div`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

/* Blurred mentor preview */
const MentorPreview = styled.div`
  background: #f8fafc;
  border-radius: 14px;
  padding: 1rem;
  margin-bottom: 1.2rem;
  filter: blur(3px);
  user-select: none;
  pointer-events: none;
  position: relative;
`;

const FakeMentorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
`;

const FakeAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  flex-shrink: 0;
`;

const FakeInfo = styled.div``;

const FakeName = styled.div`
  width: 110px;
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  margin-bottom: 6px;
`;

const FakeTag = styled.div`
  width: 80px;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
`;

const FakeStats = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const FakeStat = styled.div`
  flex: 1;
  height: 44px;
  background: white;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

/* CTA */
const LockOverlay = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const LockIcon = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  filter: none;
`;

const LockEmoji = styled.div`
  font-size: 1.6rem;
`;

const LockText = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
`;

const CTABtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
  }
`;

const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #6b7280;
`;

const CheckIcon = styled.span`
  color: #f59e0b;
  font-weight: 700;
`;

/* Confirmed state */
const ConfirmedCard = styled.div`
  background: #f0fdf4;
  border-radius: 14px;
  padding: 1.2rem;
  text-align: center;
`;

const ConfirmedIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const ConfirmedTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.3rem;
`;

const ConfirmedSub = styled.div`
  font-size: 0.78rem;
  color: #6b7280;
`;

/* Modal */
const Backdrop = styled(motion.div)`
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.6);
  backdrop-filter: blur(4px);
  z-index: 500;
  display: flex; align-items: flex-end; justify-content: center;

  @media (min-width: 640px) {
    align-items: center;
    padding: 1rem;
  }
`;

const ModalBox = styled(motion.div)`
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 1.8rem;
  width: 100%;

  @media (min-width: 640px) {
    border-radius: 20px;
    max-width: 420px;
  }
`;

const Handle = styled.div`
  width: 36px; height: 4px;
  background: #e2e8f0; border-radius: 999px;
  margin: 0 auto 1.2rem;
  @media (min-width: 640px) { display: none; }
`;

const ModalTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.3rem;
`;

const ModalSub = styled.p`
  font-size: 0.82rem;
  color: #9ca3af;
  margin-bottom: 1.2rem;
`;

const Field = styled.div`
  margin-bottom: 0.9rem;
  label { display: block; font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
`;

const Input = styled.input`
  width: 100%; padding: 0.65rem 0.9rem;
  border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 0.9rem; outline: none; box-sizing: border-box;
  &:focus { border-color: #f59e0b; }
`;

const TextArea = styled.textarea`
  width: 100%; padding: 0.65rem 0.9rem;
  border: 1px solid #e2e8f0; border-radius: 10px;
  font-size: 0.9rem; outline: none; box-sizing: border-box;
  resize: none; min-height: 90px; font-family: inherit;
  &:focus { border-color: #f59e0b; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white; border: none;
  padding: 0.8rem; border-radius: 12px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer;
  margin-top: 0.5rem;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Overlay = styled.div`
  position: absolute; top:0; left:0; right:0; bottom:0;
  background: rgba(255,255,255,0.6); backdrop-filter: blur(4px);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 10; border-radius: 20px;
`;

const OverlayText = styled.div`
  font-size: 1.1rem; font-weight: 600; color:#111827; margin-bottom: 0.5rem;
`;

const OverlayBtn = styled.button`
  background: #111827; color: white; border: none; padding: 0.6rem 1.2rem;
  border-radius: 999px; font-size: 0.9rem; cursor: pointer; margin-top: 0.4rem;
`;

const BENEFITS = [
  "Personally matched mentor for your exam + goals",
  "Weekly 1:1 guidance sessions",
  "Mentor sees your dashboard & progress",
  "WhatsApp access between sessions",
  "Personalised 30/60/90 day roadmap",
];

export default function AssignedMentor({ user }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", challenge: "" });

  useEffect(() => {
    // Check if already submitted
    const done = localStorage.getItem("saarathi_gold_submitted");
    if (done) setSubmitted(true);
  }, []);

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.phone.trim()) return;
    setSaving(true);
    try {
      await supabase.from("gold_interest").insert({
        user_id: user?.id || null,
        name: form.name,
        phone: form.phone,
        challenge: form.challenge
      });
      localStorage.setItem("saarathi_gold_submitted", "true");
      setSubmitted(true);
      setShowModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <GoldStrip />
        <Body>
          <HeaderRow>
            <TitleGroup>
              <CardTitle>
                🧑‍🏫 Your Saarathii
              </CardTitle>
              <CardSub>Personal mentor, matched for you</CardSub>
            </TitleGroup>
            <GoldBadge>⭐ Gold</GoldBadge>
          </HeaderRow>

          {submitted ? (
            <ConfirmedCard>
              <ConfirmedIcon>🎉</ConfirmedIcon>
              <ConfirmedTitle>We've received your request!</ConfirmedTitle>
              <ConfirmedSub>Our team will call you within 24 hours to match you with your Saarathii mentor.</ConfirmedSub>
            </ConfirmedCard>
          ) : (
            <>
              {/* Blurred mentor preview */}
              <LockOverlay>
                <MentorPreview>
                  <FakeMentorRow>
                    <FakeAvatar />
                    <FakeInfo>
                      <FakeName />
                      <FakeTag />
                    </FakeInfo>
                  </FakeMentorRow>
                  <FakeStats>
                    <FakeStat />
                    <FakeStat />
                    <FakeStat />
                  </FakeStats>
                </MentorPreview>
                <LockIcon>
                  <LockEmoji>🔒</LockEmoji>
                  <LockText>Your mentor is waiting</LockText>
                </LockIcon>
              </LockOverlay>

              <CTABtn onClick={() => user ? setShowModal(true) : navigate("/login")}>
                ⭐ Unlock Saarathii Gold
              </CTABtn>

              <BenefitList>
                {BENEFITS.map((b, i) => (
                  <BenefitItem key={i}>
                    <CheckIcon>✦</CheckIcon>
                    {b}
                  </BenefitItem>
                ))}
              </BenefitList>
            </>
          )}
        </Body>

        {!user && (
          <Overlay>
            <OverlayText>Log in to get your mentor</OverlayText>
            <OverlayBtn onClick={() => navigate("/login")}>Login</OverlayBtn>
          </Overlay>
        )}
      </Card>

      {/* Gold Interest Modal */}
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
              <Handle />
              <ModalTitle>⭐ Get Your Saarathii</ModalTitle>
              <ModalSub>Fill this in and our team will call you to match you with the perfect mentor.</ModalSub>

              <Field>
                <label>Your name *</label>
                <Input placeholder="Full name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </Field>

              <Field>
                <label>Phone number *</label>
                <Input placeholder="10-digit mobile number" value={form.phone} maxLength={10}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))} />
              </Field>

              <Field>
                <label>What's your biggest challenge right now?</label>
                <TextArea placeholder="e.g. I'm confused about which stream to choose and feel overwhelmed..."
                  value={form.challenge}
                  onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))} />
              </Field>

              <SubmitBtn
                onClick={handleSubmit}
                disabled={saving || !form.name.trim() || !form.phone.trim()}
              >
                {saving ? "Submitting..." : "Request My Mentor"}
              </SubmitBtn>
            </ModalBox>
          </Backdrop>
        )}
      </AnimatePresence>
    </>
  );
}
