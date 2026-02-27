import { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

const Section = styled.section`
  background: linear-gradient(135deg, #f59e0b08 0%, #f8fafc 100%);
  padding: 5rem 1.5rem;
  border-top: 1px solid #f3f4f6;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const Left = styled.div``;

const GoldBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 1rem;
`;

const Title = styled(motion.h2)`
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: #111827;
  line-height: 1.25;
  margin-bottom: 0.8rem;

  @media (min-width: 768px) { font-size: 2.2rem; }
`;

const Sub = styled.p`
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.65;
  margin-bottom: 2rem;
`;

const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 2rem;
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  font-size: 0.85rem;
  color: #374151;
  line-height: 1.5;
`;

const BenefitDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
  margin-top: 6px;
`;

/* Right — form card */
const FormCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #f3ebe6;
  box-shadow: 0 8px 30px rgba(245,158,11,0.08);
`;

const FormTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.3rem;
`;

const FormSub = styled.p`
  font-size: 0.78rem;
  color: #9ca3af;
  margin-bottom: 1.4rem;
`;

const Field = styled.div`
  margin-bottom: 0.9rem;

  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.35rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.88rem;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;

  &:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.88rem;
  outline: none;
  box-sizing: border-box;
  resize: none;
  min-height: 80px;
  font-family: inherit;

  &:focus { border-color: #f59e0b; box-shadow: 0 0 0 3px rgba(245,158,11,0.1); }
`;

const SubmitBtn = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(245,158,11,0.3);
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

const SuccessCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
`;

const SuccessTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const SuccessSub = styled.div`
  font-size: 0.83rem;
  color: #6b7280;
  line-height: 1.6;
`;

const BENEFITS = [
    "Personally matched mentor for your exam target and goals",
    "Weekly 1-on-1 video/call sessions",
    "Mentor sees your dashboard, goals, and progress",
    "WhatsApp access between sessions",
    "Personalised 30/60/90 day roadmap built for you",
    "Session notes and action items after every meeting",
    "Parent progress updates on request",
];

export default function MentorshipGoldCTA() {
    const [form, setForm] = useState({ name: "", phone: "", challenge: "" });
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(() => !!localStorage.getItem("saarathi_gold_submitted"));

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.phone.trim()) return;
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await supabase.from("gold_interest").insert({
                user_id: session?.user?.id || null,
                name: form.name,
                phone: form.phone,
                challenge: form.challenge,
            });
            localStorage.setItem("saarathi_gold_submitted", "true");
            setDone(true);
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Section id="gold-section">
            <Container>
                <Left>
                    <GoldBadge>Saarathii Gold</GoldBadge>
                    <Title
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Get a mentor personally matched to you.
                    </Title>
                    <Sub>
                        Fill the short form and our team will call you within 24 hours to understand your situation and match you with the right Saarathii.
                    </Sub>

                    <BenefitList>
                        {BENEFITS.map((b, i) => (
                            <BenefitItem key={i}>
                                <BenefitDot />
                                {b}
                            </BenefitItem>
                        ))}
                    </BenefitList>
                </Left>

                <FormCard
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <AnimatePresence mode="wait">
                        {done ? (
                            <SuccessCard
                                key="done"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <div style={{ fontSize: "2.5rem", marginBottom: "0.8rem" }}>🎉</div>
                                <SuccessTitle>We've received your request!</SuccessTitle>
                                <SuccessSub>
                                    Our team will call you within 24 hours to discuss your goals and match you with the right mentor.
                                </SuccessSub>
                            </SuccessCard>
                        ) : (
                            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <FormTitle>Request Your Mentor</FormTitle>
                                <FormSub>Free consultation — no commitment required.</FormSub>

                                <Field>
                                    <label>Your name *</label>
                                    <Input
                                        placeholder="Full name"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    />
                                </Field>

                                <Field>
                                    <label>Phone number *</label>
                                    <Input
                                        placeholder="10-digit mobile number"
                                        value={form.phone}
                                        maxLength={10}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "") }))}
                                    />
                                </Field>

                                <Field>
                                    <label>What's your biggest challenge right now?</label>
                                    <TextArea
                                        placeholder="e.g. I'm confused about which stream to choose after Class 10..."
                                        value={form.challenge}
                                        onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))}
                                    />
                                </Field>

                                <SubmitBtn
                                    onClick={handleSubmit}
                                    disabled={saving || !form.name.trim() || !form.phone.trim()}
                                >
                                    {saving ? "Submitting..." : "Request My Mentor →"}
                                </SubmitBtn>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </FormCard>
            </Container>
        </Section>
    );
}
