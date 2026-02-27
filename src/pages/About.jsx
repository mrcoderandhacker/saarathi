import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

/* ---- Layout ---- */
const HeroSection = styled.section`
  background: #0f172a;
  padding: 5.5rem 1.5rem 4rem;
`;

const HeroInner = styled(motion.div)`
  max-width: 1100px;
  margin: 0 auto;
`;

const Label = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 0.8rem;
`;

const HeroTitle = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 2.4rem;
  color: white;
  line-height: 1.2;
  margin-bottom: 0.8rem;
  max-width: 580px;
  @media (min-width: 768px) { font-size: 3rem; }
`;

const HeroSub = styled.p`
  font-size: 0.92rem;
  color: rgba(255,255,255,0.45);
  max-width: 480px;
  line-height: 1.7;
`;

/* ---- Content ---- */
const ContentSection = styled.section`
  background: #f8fafc;
  padding: 4rem 1.5rem;
`;

const Inner = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 3rem;

  @media (min-width: 768px) { grid-template-columns: 1fr 1fr; }
`;

const ValueCard = styled(motion.div)`
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 100%; height: 3px;
    background: ${p => p.accent};
    border-radius: 18px 18px 0 0;
  }
`;

const CardNum = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${p => p.color};
  margin-bottom: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.4rem;
`;

const CardText = styled.p`
  font-size: 0.82rem;
  color: #6b7280;
  line-height: 1.65;
`;

const SectionLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.7rem;
`;

const SectionTitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.7rem;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const SectionSub = styled.p`
  font-size: 0.88rem;
  color: #6b7280;
  max-width: 500px;
  line-height: 1.65;
`;

/* ---- Contact ---- */
const ContactSection = styled.section`
  background: white;
  padding: 4rem 1.5rem;
  border-top: 1px solid #e2e8f0;
`;

const ContactGrid = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 680px) { grid-template-columns: 1fr 1fr 1fr; }
`;

const ContactCard = styled.a`
  display: block;
  background: #f8fafc;
  border-radius: 14px;
  padding: 1.3rem;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  transition: all 0.2s;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
`;

const ContactType = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 0.4rem;
`;

const ContactValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
`;

const CTASection = styled.section`
  background: #0f172a;
  padding: 4rem 1.5rem;
  text-align: center;
`;

const CTATitle = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: white;
  margin-bottom: 0.6rem;
`;

const CTASub = styled.p`
  font-size: 0.88rem;
  color: rgba(255,255,255,0.45);
  margin-bottom: 1.5rem;
`;

const CTABtn = styled.button`
  background: white;
  color: #0f172a;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(255,255,255,0.12); }
`;

const VALUES = [
    { num: "01", title: "Clarity over confusion", text: "Most students are stuck because nobody gives them a clear answer. We do.", accent: "#6366f1", color: "#6366f1" },
    { num: "02", title: "Human first, AI second", text: "AI can guide. But a real mentor who has walked your path is irreplaceable.", accent: "#f59e0b", color: "#f59e0b" },
    { num: "03", title: "Not just study advice", text: "We care about your whole life — your passions, your mental health, your direction.", accent: "#10b981", color: "#10b981" },
    { num: "04", title: "Built for India", text: "We understand the pressure of boards, droppers, parental expectations, and JEE dreams.", accent: "#ec4899", color: "#ec4899" },
];

export default function About() {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />

            <HeroSection>
                <HeroInner
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Label>About Saarathii</Label>
                    <HeroTitle>We built this because we needed it.</HeroTitle>
                    <HeroSub>
                        Saarathii was built by people who remember exactly how confusing and overwhelming school felt. No one told us what was possible. We're changing that.
                    </HeroSub>
                </HeroInner>
            </HeroSection>

            <ContentSection>
                <Inner>
                    <SectionLabel>What we believe</SectionLabel>
                    <SectionTitle>The values behind Saarathii.</SectionTitle>
                    <SectionSub>These aren't taglines — they shape every feature we build.</SectionSub>

                    <Grid>
                        {VALUES.map((v, i) => (
                            <ValueCard
                                key={v.num}
                                accent={v.accent}
                                initial={{ opacity: 0, y: 14 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.07 }}
                            >
                                <CardNum color={v.color}>{v.num}</CardNum>
                                <CardTitle>{v.title}</CardTitle>
                                <CardText>{v.text}</CardText>
                            </ValueCard>
                        ))}
                    </Grid>
                </Inner>
            </ContentSection>

            {/* Contact */}
            <ContactSection>
                <Inner>
                    <SectionLabel>Get in touch</SectionLabel>
                    <SectionTitle>We would love to hear from you.</SectionTitle>
                    <SectionSub style={{ marginBottom: "0" }}>
                        Whether you are a student, parent, or potential mentor — reach out.
                    </SectionSub>
                </Inner>
                <ContactGrid style={{ maxWidth: "900px", margin: "2rem auto 0" }}>
                    <ContactCard href="mailto:hello@saarathii.com">
                        <ContactType>Email</ContactType>
                        <ContactValue>hello@saarathii.com</ContactValue>
                    </ContactCard>
                    <ContactCard href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <ContactType>Instagram</ContactType>
                        <ContactValue>@saarathii</ContactValue>
                    </ContactCard>
                    <ContactCard href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <ContactType>LinkedIn</ContactType>
                        <ContactValue>Saarathii</ContactValue>
                    </ContactCard>
                </ContactGrid>
            </ContactSection>

            <CTASection>
                <CTATitle>Ready to find your path?</CTATitle>
                <CTASub>It's free to start. No commitment required.</CTASub>
                <CTABtn onClick={() => navigate("/signup")}>Get started free →</CTABtn>
            </CTASection>

            <Footer />
        </>
    );
}
