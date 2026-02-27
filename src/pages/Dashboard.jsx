import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import GoalTracker from "../components/dashboard/GoalTracker";
import AssignedMentor from "../components/dashboard/AssignedMentor";
import LifeBalanceRing from "../components/dashboard/LifeBalanceRing";
import SavedColleges from "../components/dashboard/SavedColleges";
import DailyRoutine from "../components/dashboard/DailyRoutine";
import DashboardOnboarding from "../components/dashboard/DashboardOnboarding";
import StreakBanner from "../components/dashboard/StreakBanner";
import WeeklyReport from "../components/dashboard/WeeklyReport";
import DailyCheckin from "../components/dashboard/DailyCheckin";
import ExamCountdown from "../components/dashboard/ExamCountdown";

const Layout = styled.div`
  min-height: 100vh;
  background: #f1f5f9;
  padding-top: 80px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1.2rem;

  @media (min-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const WelcomeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const WelcomeText = styled.div``;

const Greeting = styled(motion.h1)`
  font-family: "Playfair Display", serif;
  font-size: 1.7rem;
  color: #0f172a;
  margin-bottom: 0.2rem;

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  color: #64748b;
  font-size: 1rem;
`;

const ScoreBanner = styled(motion.div)`
  background: linear-gradient(135deg, #1e1b4b, #312e81);
  border-radius: 16px;
  padding: 1rem 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  min-width: 220px;
`;

const ScoreCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.1);
  flex-shrink: 0;
`;

const ScoreNum = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1;
`;

const ScoreLabel = styled.div`
  font-size: 0.55rem;
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const ScoreInfo = styled.div``;
const ScoreTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
`;
const ScoreSub = styled.div`
  font-size: 0.78rem;
  opacity: 0.7;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
`;

const GridItem = styled.div`
  grid-column: span ${p => p.desktopSpan || 12};

  @media (max-width: 992px) {
    grid-column: span ${p => p.tabletSpan || 12};
  }

  @media (max-width: 768px) {
    grid-column: span 12;
  }
`;

const SCORE_LABELS = ["Beginner", "Explorer", "Consistent", "Dedicated", "Champion"];
const getLevel = (score) => SCORE_LABELS[Math.min(Math.floor(score / 20), 4)];

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [lifeScore, setLifeScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const usr = session.user;
      setUser(usr);
      const nameParts = usr.user_metadata?.full_name?.split(" ") || [];
      setUserName(nameParts[0] || "");

      // Fetch profile — check onboarding & life score
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_done, life_score")
        .eq("id", usr.id)
        .maybeSingle();

      if (!profile || !profile.onboarding_done) {
        setShowOnboarding(true);
      }

      // Calculate life score from task completions this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 6);
      const { count } = await supabase
        .from("task_completions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", usr.id)
        .gte("completed_date", weekStart.toISOString().split("T")[0]);

      setLifeScore(Math.min((count || 0) * 5, 100));
    }
    setLoading(false);
  };

  if (loading) return <Layout />;

  return (
    <>
      <AnimatePresence>
        {showOnboarding && user && (
          <DashboardOnboarding userId={user.id} onDone={() => setShowOnboarding(false)} />
        )}
      </AnimatePresence>

      <Layout>
        <Container>
          <WelcomeRow>
            <WelcomeText>
              <Greeting initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                {userName ? `Hey, ${userName} 👋` : "Your Dashboard"}
              </Greeting>
              <Subtitle initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                {user
                  ? "Your path is looking clearer every day. Let's keep going."
                  : "See what your personalised life planner looks like."}
              </Subtitle>
            </WelcomeText>

            {user && (
              <ScoreBanner
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ScoreCircle>
                  <ScoreNum>{lifeScore}</ScoreNum>
                  <ScoreLabel>Score</ScoreLabel>
                </ScoreCircle>
                <ScoreInfo>
                  <ScoreTitle>Life Score</ScoreTitle>
                  <ScoreSub>{getLevel(lifeScore)} · Keep going 🔥</ScoreSub>
                </ScoreInfo>
              </ScoreBanner>
            )}
            {user && <ExamCountdown user={user} />}
          </WelcomeRow>

          {/* Streak banner */}
          {user && <StreakBanner user={user} />}

          {/* Daily check-in */}
          {user && <DailyCheckin user={user} />}

          <Grid>
            {/* Goals — full width */}
            <GridItem desktopSpan={7}>
              <GoalTracker user={user} />
            </GridItem>

            {/* Mentor */}
            <GridItem desktopSpan={5}>
              <AssignedMentor user={user} />
            </GridItem>

            {/* Daily Routine — full width */}
            <GridItem desktopSpan={12}>
              <DailyRoutine user={user} />
            </GridItem>

            {/* Life Balance */}
            <GridItem desktopSpan={6}>
              <LifeBalanceRing user={user} />
            </GridItem>

            {/* Saved Colleges */}
            <GridItem desktopSpan={6}>
              <SavedColleges user={user} />
            </GridItem>

            {/* Weekly Report */}
            <GridItem desktopSpan={12}>
              <WeeklyReport user={user} />
            </GridItem>
          </Grid>
        </Container>
      </Layout>
    </>
  );
}
