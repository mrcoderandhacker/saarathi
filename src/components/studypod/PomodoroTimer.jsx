import { useState, useEffect, useRef, useCallback } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50% { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
`;

const Panel = styled.div`
  background: ${p => p.panelBg || 'rgba(255,255,255,0.06)'};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ModeBar = styled.div`
  display: flex;
  gap: 0.3rem;
  background: rgba(0,0,0,0.3);
  border-radius: 999px;
  padding: 0.3rem;
  width: 100%;
`;

const ModeBtn = styled.button`
  flex: 1;
  padding: 0.4rem 0;
  border-radius: 999px;
  border: none;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.active ? p.accent : 'transparent'};
  color: ${p => p.active ? 'white' : 'rgba(255,255,255,0.5)'};
`;

const TimerRing = styled.div`
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${p => p.running && css`animation: ${pulse} 3s ease-in-out infinite;`}
  border-radius: 50%;
  margin: 1rem 0;
`;

const TimerLabel = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
`;

const TimeDisplay = styled.div`
  font-size: 2.4rem;
  font-weight: 800;
  color: ${p => p.accent || '#e2e8f0'};
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
`;

const ModeLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
`;

const ControlRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ControlBtn = styled(motion.button)`
  width: ${p => p.primary ? '52px' : '38px'};
  height: ${p => p.primary ? '52px' : '38px'};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${p => p.primary ? '1.3rem' : '1rem'};
  transition: background 0.2s;
  background: ${p => p.primary ? p.accent : 'rgba(255,255,255,0.08)'};
  color: white;

  &:hover { filter: brightness(1.15); }
`;

const TomatoRow = styled.div`
  display: flex;
  gap: 0.3rem;
  align-items: center;
  justify-content: center;
`;

const Tomato = styled.span`
  font-size: ${p => p.done ? '1rem' : '0.7rem'};
  opacity: ${p => p.done ? 1 : 0.25};
  transition: all 0.3s;
`;

const SettingsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const TimeInput = styled.div`
  flex: 1;
  background: rgba(0,0,0,0.2);
  border-radius: 10px;
  padding: 0.4rem 0.6rem;
  text-align: center;

  label {
    display: block;
    font-size: 0.6rem;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.2rem;
  }

  input {
    width: 100%;
    background: transparent;
    border: none;
    color: white;
    font-size: 0.9rem;
    font-weight: 700;
    text-align: center;
    outline: none;
    -moz-appearance: textfield;
    &::-webkit-inner-spin-button { display: none; }
  }
`;

const MODES = {
    focus: { label: 'Focus', default: 25 },
    short: { label: 'Short Break', default: 5 },
    long: { label: 'Long Break', default: 15 },
};

// Synthesize a soft bell sound using Web Audio API
function playBell(audioCtx) {
    if (!audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 1.5);
    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 2);
}

export default function PomodoroTimer({ accent, panelBg, onSessionComplete, onRunningChange }) {
    const [mode, setMode] = useState('focus');
    const [durations, setDurations] = useState({ focus: 25, short: 5, long: 15 });
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [running, setRunning] = useState(false);
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const intervalRef = useRef(null);
    const audioCtxRef = useRef(null);

    useEffect(() => {
        onRunningChange?.(running);
    }, [running, onRunningChange]);

    const totalTime = durations[mode] * 60;
    const circumference = 2 * Math.PI * 54;
    const progress = timeLeft / totalTime;
    const strokeDashoffset = circumference * (1 - progress);

    const getAudioCtx = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtxRef.current;
    }, []);

    useEffect(() => {
        setTimeLeft(durations[mode] * 60);
        setRunning(false);
        clearInterval(intervalRef.current);
    }, [mode, durations]);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current);
                        setRunning(false);
                        playBell(getAudioCtx());
                        if (mode === 'focus') {
                            const newCount = pomodoroCount + 1;
                            setPomodoroCount(newCount);
                            onSessionComplete?.({ pomodoros: newCount, mode });
                            // Auto-switch to break
                            setTimeout(() => setMode(newCount % 4 === 0 ? 'long' : 'short'), 1500);
                        } else {
                            setTimeout(() => setMode('focus'), 1500);
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running, mode, pomodoroCount, getAudioCtx, onSessionComplete]);

    // Update tab title when running
    useEffect(() => {
        if (running) {
            document.title = `🎯 ${mode === 'focus' ? 'Focusing' : 'Break'} — ${fmt(timeLeft)} | Saarathii`;
        } else {
            document.title = 'Study Pod | Saarathii';
        }
        return () => { document.title = 'Saarathii'; };
    }, [running, timeLeft, mode]);

    const fmt = t => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`;

    const handleStart = () => {
        getAudioCtx(); // Unlock audio on first user gesture
        setRunning(r => !r);
    };

    const handleReset = () => {
        setRunning(false);
        setTimeLeft(durations[mode] * 60);
    };

    const updateDuration = (m, val) => {
        const n = Math.max(1, Math.min(90, Number(val)));
        setDurations(d => ({ ...d, [m]: n }));
    };

    return (
        <Panel panelBg={panelBg}>
            {/* Mode selector */}
            <ModeBar>
                {Object.entries(MODES).map(([k, v]) => (
                    <ModeBtn key={k} active={mode === k} accent={accent} onClick={() => setMode(k)}>
                        {v.label}
                    </ModeBtn>
                ))}
            </ModeBar>

            {/* SVG Ring Timer */}
            <TimerRing running={running}>
                <svg width="200" height="200" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                    <defs>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    {/* Background track */}
                    <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                    {/* Progress track */}
                    <circle
                        cx="100" cy="100" r="80"
                        fill="none"
                        stroke={accent || '#6366f1'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 80}
                        strokeDashoffset={(2 * Math.PI * 80) * (1 - progress)}
                        filter="url(#glow)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <TimerLabel>
                    <TimeDisplay accent={accent}>{fmt(timeLeft)}</TimeDisplay>
                    <ModeLabel>{MODES[mode].label}</ModeLabel>
                </TimerLabel>
            </TimerRing>

            {/* Controls */}
            <ControlRow>
                <ControlBtn onClick={handleReset} whileTap={{ scale: 0.9 }}>⟳</ControlBtn>
                <ControlBtn
                    primary
                    accent={accent}
                    onClick={handleStart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {running ? '⏸' : '▶'}
                </ControlBtn>
                <ControlBtn onClick={() => { setRunning(false); setMode(mode === 'focus' ? 'short' : 'focus'); }} whileTap={{ scale: 0.9 }}>⏭</ControlBtn>
            </ControlRow>

            {/* Pomodoro counter */}
            <TomatoRow>
                {Array.from({ length: 8 }).map((_, i) => (
                    <Tomato key={i} done={i < pomodoroCount}>🍅</Tomato>
                ))}
            </TomatoRow>

            {/* Custom durations */}
            <SettingsRow>
                {Object.entries(MODES).map(([k, v]) => (
                    <TimeInput key={k}>
                        <label>{v.label}</label>
                        <input
                            type="number"
                            value={durations[k]}
                            onChange={e => updateDuration(k, e.target.value)}
                            min={1} max={90}
                        />
                    </TimeInput>
                ))}
            </SettingsRow>
        </Panel>
    );
}
