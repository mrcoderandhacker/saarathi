import { useState, useCallback, useEffect, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabaseDb, supabase } from "../lib/supabase";
import PomodoroTimer from "../components/studypod/PomodoroTimer";
import AmbientMixer from "../components/studypod/AmbientMixer";
import YouTubePlayer from "../components/studypod/YouTubePlayer";
import ThemeSwitcher, { THEMES } from "../components/studypod/ThemeSwitcher";
import SessionSidebar from "../components/studypod/SessionSidebar";
import SessionSummary from "../components/studypod/SessionSummary";
import StudyHistory from "../components/studypod/StudyHistory";

const PodGlobal = createGlobalStyle`
  body { overflow: hidden; }
`;

const PodPage = styled.div`
  position: fixed;
  inset: 0;
  background: ${p => p.bg};
  display: flex;
  flex-direction: column;
  color: ${p => p.textColor};
  font-family: 'Inter', sans-serif;
  transition: background 0.6s ease;
  overflow: hidden;
  
  /* Dynamic animated background when running */
  ${p => p.running && `
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `}
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: rgba(0,0,0,0.25);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
  z-index: 10;
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TopBtn = styled(motion.button)`
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.14); color: white; }
`;

const FocusToggle = styled(motion.button)`
  background: ${p => p.focused ? p.accent : 'rgba(255,255,255,0.08)'};
  border: 1px solid ${p => p.focused ? p.accent : 'rgba(255,255,255,0.1)'};
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`;

const MainGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr 300px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  overflow: hidden;

  /* Hide sidebars if focused mode */
  ${p => p.focused && `
    grid-template-columns: 1fr;
    padding: 2rem 5rem;
  `}

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    overflow-y: auto;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
`;

const CenterPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 0;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ThemeCard = styled.div`
  background: ${p => p.panelBg};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 1.2rem 1.5rem;
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(16,185,129,0.12);
  border: 1px solid rgba(16,185,129,0.25);
  border-radius: 999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: #10b981;
  letter-spacing: 0.05em;

  &::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #10b981;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;

const CenterToggleBar = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CenterToggle = styled.button`
  flex: 1;
  padding: 0.5rem;
  background: ${p => p.active ? p.accent : 'rgba(255,255,255,0.07)'};
  color: ${p => p.active ? 'white' : 'rgba(255,255,255,0.5)'};
  border: 1px solid ${p => p.active ? p.accent : 'transparent'};
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
`;

export default function StudyPod() {
    const navigate = useNavigate();
    const [themeKey, setThemeKey] = useState('midnight');
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [session, setSession] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [rightTab, setRightTab] = useState('session'); // 'session' | 'history'
    const [centerTab, setCenterTab] = useState('youtube'); // 'youtube' | 'spotify'
    const sidebarRef = useRef(null);

    const theme = THEMES[themeKey];

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
    }, []);

    useEffect(() => {
        const onChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onChange);
        return () => document.removeEventListener('fullscreenchange', onChange);
    }, []);

    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUserId(session?.user?.id || null);
        };
        fetchUser();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id || null);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    const handlePomodoroComplete = useCallback(({ pomodoros }) => {
        setPomodoroCount(pomodoros);
    }, []);

    const handleEndSession = useCallback(async (data) => {
        setSession(data);
        setShowSummary(true);
        setRightTab('history');

        if (userId) {
            await supabaseDb.from('study_sessions').insert({
                user_id: userId,
                focus_minutes: Math.round((data.elapsedSeconds || 0) / 60),
                pomodoros_completed: data.pomodoroCount,
                session_goal: data.goal,
                tasks_completed: data.tasksCompleted,
                vibe_theme: themeKey,
                started_at: new Date(Date.now() - (data.elapsedSeconds || 0) * 1000).toISOString(),
                ended_at: new Date().toISOString(),
            });
        }
    }, [userId, themeKey]);

    const handleLoadTemplate = useCallback((t) => {
        if (t.theme) setThemeKey(t.theme);
        // Signal sidebar to load goal + tasks
        if (sidebarRef.current?.loadTemplate) {
            sidebarRef.current.loadTemplate(t);
        }
        setRightTab('session');
    }, []);

    const handleNewSession = () => {
        setShowSummary(false);
        setSession(null);
        setPomodoroCount(0);
        setRightTab('session');
    };

    return (
        <>
            <PodGlobal />
            <PodPage bg={theme.bg} textColor={theme.text} running={timerRunning}>
                {/* Top Bar */}
                {!focusMode && (
                    <TopBar>
                        <Logo>
                            <span style={{ fontSize: '1.2rem' }}>🎯</span>
                            Study Pod
                            <LiveBadge>LIVE</LiveBadge>
                        </Logo>
                        <TopRight>
                            <FocusToggle
                                focused={focusMode}
                                accent={theme.accent}
                                onClick={() => setFocusMode(f => !f)}
                                whileTap={{ scale: 0.95 }}
                            >
                                🔒 Focus Mode
                            </FocusToggle>
                            <TopBtn onClick={toggleFullscreen} whileTap={{ scale: 0.95 }}>
                                {isFullscreen ? '🔲 Exit Fullscreen' : '🔲 Fullscreen'}
                            </TopBtn>
                            <TopBtn onClick={() => navigate('/dashboard')} whileTap={{ scale: 0.95 }}>
                                ← Dashboard
                            </TopBtn>
                        </TopRight>
                    </TopBar>
                )}

                {/* Main Grid */}
                <MainGrid focused={focusMode}>
                    {/* LEFT: Timer + Mixer + Theme */}
                    <AnimatePresence>
                        {!focusMode && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ display: 'contents' }}
                            >
                                <LeftPanel>
                                    <PomodoroTimer
                                        accent={theme.accent}
                                        panelBg={theme.panelBg}
                                        onSessionComplete={handlePomodoroComplete}
                                        onRunningChange={setTimerRunning}
                                    />
                                    <AmbientMixer accent={theme.accent} panelBg={theme.panelBg} />
                                    <ThemeCard panelBg={theme.panelBg}>
                                        <ThemeSwitcher currentTheme={themeKey} onChange={setThemeKey} />
                                    </ThemeCard>
                                </LeftPanel>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CENTER: Video/Music Player & Focus Controls */}
                    <CenterPanel>
                        {focusMode && (
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                <FocusToggle
                                    focused={focusMode}
                                    accent={theme.accent}
                                    onClick={() => setFocusMode(false)}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🔓 Exit Focus
                                </FocusToggle>
                            </div>
                        )}
                        <YouTubePlayer
                            accent={theme.accent}
                            panelBg={theme.panelBg}
                            userId={userId}
                        />
                    </CenterPanel>

                    {/* RIGHT: Session / History Panel */}
                    <AnimatePresence>
                        {!focusMode && (
                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: 0 }}
                            >
                                {/* Tab switcher */}
                                <div style={{ display: 'flex', gap: '0.4rem' }}>
                                    {['session', 'history'].map(t => (
                                        <button key={t} onClick={() => setRightTab(t)} style={{
                                            flex: 1, padding: '0.45rem', border: 'none', borderRadius: '10px',
                                            background: rightTab === t ? theme.accent : 'rgba(255,255,255,0.07)',
                                            color: rightTab === t ? 'white' : 'rgba(255,255,255,0.45)',
                                            fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
                                            textTransform: 'capitalize', transition: 'all 0.2s'
                                        }}>
                                            {t === 'session' ? '📋 Session' : '📊 History'}
                                        </button>
                                    ))}
                                </div>

                                <RightPanel>
                                    {rightTab === 'session' ? (
                                        <SessionSidebar
                                            ref={sidebarRef}
                                            accent={theme.accent}
                                            panelBg={theme.panelBg}
                                            pomodoroCount={pomodoroCount}
                                            onEndSession={handleEndSession}
                                        />
                                    ) : (
                                        <StudyHistory
                                            accent={theme.accent}
                                            panelBg={theme.panelBg}
                                            userId={userId}
                                            currentSession={{ theme: themeKey }}
                                            onLoadTemplate={handleLoadTemplate}
                                        />
                                    )}
                                </RightPanel>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </MainGrid>

                {/* Session Summary Modal */}
                <AnimatePresence>
                    {showSummary && (
                        <SessionSummary
                            session={session}
                            accent={theme.accent}
                            onNewSession={handleNewSession}
                            onClose={() => setShowSummary(false)}
                        />
                    )}
                </AnimatePresence>
            </PodPage>
        </>
    );
}
