import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const Section = styled.section`
  background: #0f172a;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem;
`;

const Inner = styled(motion.div)`
  text-align: center;
  max-width: 480px;
`;

const Code = styled.div`
  font-size: 5rem;
  font-weight: 800;
  color: rgba(255,255,255,0.08);
  font-family: "Playfair Display", serif;
  line-height: 1;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  color: white;
  margin-bottom: 0.7rem;
`;

const Sub = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.45);
  line-height: 1.65;
  margin-bottom: 2rem;
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled.button`
  background: white;
  color: #0f172a;
  border: none;
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(255,255,255,0.12); }
`;

const SecondaryBtn = styled.button`
  background: transparent;
  color: rgba(255,255,255,0.65);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 0.7rem 1.6rem;
  border-radius: 999px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: rgba(255,255,255,0.5); color: white; }
`;

export default function NotFound() {
    const navigate = useNavigate();
    return (
        <>
            <Navbar />
            <Section>
                <Inner
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Code>404</Code>
                    <Title>Page not found.</Title>
                    <Sub>
                        The page you're looking for doesn't exist or was moved. Let's get you back on track.
                    </Sub>
                    <BtnRow>
                        <PrimaryBtn onClick={() => navigate("/")}>Go home</PrimaryBtn>
                        <SecondaryBtn onClick={() => navigate("/dashboard")}>Go to Dashboard</SecondaryBtn>
                    </BtnRow>
                </Inner>
            </Section>
            <Footer />
        </>
    );
}
