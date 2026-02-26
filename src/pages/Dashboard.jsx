import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import GoalTracker from "../components/dashboard/GoalTracker";
import AssignedMentor from "../components/dashboard/AssignedMentor";
import LifeBalanceRing from "../components/dashboard/LifeBalanceRing";
import SavedColleges from "../components/dashboard/SavedColleges";

const Layout = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
  padding-top: 80px; /* Account for Navbar */
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`;

const WelcomeRow = styled.div`
  margin-bottom: 2rem;
`;

const Greeting = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 2.5rem;
  color: #0f172a;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled(motion.p)`
  color: #64748b;
  font-size: 1.1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
`;

const GridItem = styled.div`
  /* Responsive grid rules */
  grid-column: span ${props => props.desktopSpan || 12};
  
  @media (max-width: 992px) {
    grid-column: span ${props => props.tabletSpan || 12};
  }
  
  @media (max-width: 768px) {
    grid-column: span 12;
  }
`;

export default function Dashboard() {
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            // If not logged in, redirect to auth/signup
            navigate("/signup");
        } else {
            // Capitalize first name for greeting
            const nameParts = session.user.user_metadata?.full_name?.split(' ') || ["Explorer"];
            setUserName(nameParts[0]);
        }
        setLoading(false);
    };

    if (loading) return <Layout />;

    return (
        <Layout>
            <Container>
                <WelcomeRow>
                    <Greeting
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Welcome back, {userName}
                    </Greeting>
                    <Subtitle
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        Your path is looking clearer every day. Let's see what's next.
                    </Subtitle>
                </WelcomeRow>

                <Grid>
                    {/* Top Row: Path & Mentor */}
                    <GridItem desktopSpan={7}>
                        <GoalTracker />
                    </GridItem>

                    <GridItem desktopSpan={5}>
                        <AssignedMentor />
                    </GridItem>

                    {/* Bottom Row: Balance & Colleges */}
                    <GridItem desktopSpan={6}>
                        <LifeBalanceRing studyHours={28} passionHours={14} restHours={56} />
                    </GridItem>

                    <GridItem desktopSpan={6}>
                        <SavedColleges />
                    </GridItem>
                </Grid>

            </Container>
        </Layout>
    );
}
