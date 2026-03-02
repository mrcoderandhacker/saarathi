import { useState, useRef, useCallback, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const Panel = styled.div`
  background: ${p => p.panelBg || 'rgba(255,255,255,0.06)'};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
  margin-bottom: 0.2rem;
`;

const SoundGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
`;

const SoundCard = styled(motion.div)`
  background: ${p => p.active ? `${p.accent}22` : 'rgba(255,255,255,0.04)'};
  border: 1px solid ${p => p.active ? p.accent : 'rgba(255,255,255,0.08)'};
  border-radius: 12px;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  
  .sound-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${p => p.active ? '0.5rem' : '0'};
  }

  .sound-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: ${p => p.active ? 'white' : 'rgba(255,255,255,0.5)'};
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  .sound-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: ${p => p.accent};
    opacity: ${p => p.active ? 1 : 0};
    transition: opacity 0.2s;
  }
`;

const VolumeSlider = styled.input`
  width: 100%;
  height: 3px;
  -webkit-appearance: none;
  background: linear-gradient(
    to right,
    ${p => p.accent} 0%,
    ${p => p.accent} ${p => p.value}%,
    rgba(255,255,255,0.2) ${p => p.value}%
  );
  border-radius: 999px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px; height: 12px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
  }
`;

const PresetRow = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

const PresetBtn = styled(motion.button)`
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.12); color: white; }
`;

const MuteAll = styled(motion.button)`
  width: 100%;
  padding: 0.5rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,0,0,0.08);
  color: rgba(255,100,100,0.8);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255,0,0,0.15); color: white; }
`;

const SOUNDS = [
    { id: 'rain', emoji: '🌧️', label: 'Rain' },
    { id: 'cafe', emoji: '☕', label: 'Café' },
    { id: 'ocean', emoji: '🌊', label: 'Ocean' },
    { id: 'fire', emoji: '🔥', label: 'Fireplace' },
    { id: 'forest', emoji: '🌿', label: 'Forest' },
    { id: 'noise', emoji: '〰️', label: 'White Noise' },
];

const PRESETS = {
    'Study Vibe': { rain: 60, cafe: 30, ocean: 0, fire: 0, forest: 0, noise: 0 },
    'Lock In': { rain: 0, cafe: 0, ocean: 0, fire: 0, forest: 0, noise: 70 },
    'Relax Mode': { rain: 40, cafe: 0, ocean: 60, fire: 30, forest: 20, noise: 0 },
    'Nature': { rain: 30, cafe: 0, ocean: 20, fire: 0, forest: 80, noise: 0 },
};

// Web Audio API sound generators
function createRain(ctx) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 400;
    src.connect(filter);
    return { src, out: filter };
}

function createCafe(ctx) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 600; filter.Q.value = 0.5;
    src.connect(filter);
    return { src, out: filter };
}

function createOcean(ctx) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        data[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(t * 0.5));
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 600;
    src.connect(filter);
    return { src, out: filter };
}

function createFire(ctx) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.98 ? 0.8 : 0.1);
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 200; filter.Q.value = 0.3;
    src.connect(filter);
    return { src, out: filter };
}

function createForest(ctx) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < data.length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179; b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520; b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522; b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) / 7;
        b6 = white * 0.115926;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    return { src, out: src };
}

function createNoise(ctx) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    return { src, out: src };
}

const GENERATORS = { rain: createRain, cafe: createCafe, ocean: createOcean, fire: createFire, forest: createForest, noise: createNoise };

export default function AmbientMixer({ accent, panelBg }) {
    const [volumes, setVolumes] = useState({ rain: 0, cafe: 0, ocean: 0, fire: 0, forest: 0, noise: 0 });
    const ctxRef = useRef(null);
    const nodesRef = useRef({});

    const getCtx = useCallback(() => {
        if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        return ctxRef.current;
    }, []);

    const ensureNode = useCallback((id) => {
        const ctx = getCtx();
        if (!nodesRef.current[id]) {
            const { src, out } = GENERATORS[id](ctx);
            const gain = ctx.createGain();
            gain.gain.value = 0;
            out.connect(gain);
            gain.connect(ctx.destination);
            src.start();
            nodesRef.current[id] = { gain };
        }
        return nodesRef.current[id];
    }, [getCtx]);

    const setVolume = useCallback((id, vol) => {
        setVolumes(v => ({ ...v, [id]: vol }));
        const ctx = getCtx();
        const node = ensureNode(id);
        node.gain.gain.setTargetAtTime(vol / 100 * 0.6, ctx.currentTime, 0.1);
    }, [getCtx, ensureNode]);

    const applyPreset = useCallback((preset) => {
        const vols = PRESETS[preset];
        Object.entries(vols).forEach(([id, vol]) => setVolume(id, vol));
    }, [setVolume]);

    const muteAll = useCallback(() => {
        SOUNDS.forEach(s => setVolume(s.id, 0));
    }, [setVolume]);

    return (
        <Panel panelBg={panelBg}>
            <SectionTitle>🎵 Ambient Sounds</SectionTitle>

            <PresetRow>
                {Object.keys(PRESETS).map(p => (
                    <PresetBtn key={p} onClick={() => applyPreset(p)} whileTap={{ scale: 0.95 }}>{p}</PresetBtn>
                ))}
            </PresetRow>

            <SoundGrid>
                {SOUNDS.map(s => {
                    const vol = volumes[s.id];
                    const active = vol > 0;
                    return (
                        <SoundCard
                            key={s.id}
                            active={active}
                            accent={accent}
                            onClick={() => !active && setVolume(s.id, 50)}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="sound-top">
                                <div className="sound-label">
                                    <span>{s.emoji}</span> {s.label}
                                </div>
                                <div className="sound-dot" />
                            </div>
                            {active && (
                                <VolumeSlider
                                    type="range" min={0} max={100}
                                    value={vol}
                                    accent={accent}
                                    onChange={e => setVolume(s.id, Number(e.target.value))}
                                    onClick={e => e.stopPropagation()}
                                />
                            )}
                        </SoundCard>
                    );
                })}
            </SoundGrid>

            <MuteAll onClick={muteAll} whileTap={{ scale: 0.97 }}>
                🔇 Mute All Sounds
            </MuteAll>
        </Panel>
    );
}
