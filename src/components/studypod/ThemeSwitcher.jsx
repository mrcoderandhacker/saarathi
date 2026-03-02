import styled from "styled-components";
import { motion } from "framer-motion";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
`;

const ThemeGrid = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ThemeBtn = styled(motion.button)`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid ${p => p.active ? 'white' : 'transparent'};
  background: ${p => p.preview};
  cursor: pointer;
  outline: none;
  transition: transform 0.15s, border-color 0.15s;
  position: relative;
  box-shadow: ${p => p.active ? `0 0 0 3px ${p.accent}66` : 'none'};

  &:hover { transform: scale(1.15); }

  &::after {
    content: attr(data-name);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    font-size: 0.65rem;
    padding: 0.2rem 0.5rem;
    border-radius: 5px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s;
  }
  &:hover::after { opacity: 1; }
`;

const ActiveName = styled.div`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  gap: 0.4rem;

  span { color: white; font-weight: 600; }
`;

export const THEMES = {
    midnight: {
        name: 'Midnight',
        emoji: '🌙',
        bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        panelBg: 'rgba(255,255,255,0.05)',
        accent: '#6366f1',
        text: '#e2e8f0',
        preview: 'linear-gradient(135deg, #302b63, #6366f1)',
    },
    forest: {
        name: 'Forest',
        emoji: '🌲',
        bg: 'linear-gradient(135deg, #0a1628 0%, #1a2e1a 50%, #0d1f0d 100%)',
        panelBg: 'rgba(255,255,255,0.05)',
        accent: '#22c55e',
        text: '#d1fae5',
        preview: 'linear-gradient(135deg, #1a2e1a, #22c55e)',
    },
    ocean: {
        name: 'Deep Ocean',
        emoji: '🌊',
        bg: 'linear-gradient(135deg, #0c1b33 0%, #0d3b6e 50%, #0a2447 100%)',
        panelBg: 'rgba(255,255,255,0.05)',
        accent: '#38bdf8',
        text: '#bae6fd',
        preview: 'linear-gradient(135deg, #0d3b6e, #38bdf8)',
    },
    golden: {
        name: 'Golden Hour',
        emoji: '☀️',
        bg: 'linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #5c2800 100%)',
        panelBg: 'rgba(255,255,255,0.05)',
        accent: '#f59e0b',
        text: '#fde68a',
        preview: 'linear-gradient(135deg, #5c2800, #f59e0b)',
    },
    nightcity: {
        name: 'Night City',
        emoji: '🏙️',
        bg: 'linear-gradient(135deg, #0d0019 0%, #1a0033 50%, #0d001a 100%)',
        panelBg: 'rgba(255,255,255,0.05)',
        accent: '#e879f9',
        text: '#f0abfc',
        preview: 'linear-gradient(135deg, #1a0033, #e879f9)',
    },
};

export default function ThemeSwitcher({ currentTheme, onChange }) {
    const theme = THEMES[currentTheme];
    return (
        <Wrapper>
            <SectionTitle>🎨 Vibe Theme</SectionTitle>
            <ThemeGrid>
                {Object.entries(THEMES).map(([key, t]) => (
                    <ThemeBtn
                        key={key}
                        preview={t.preview}
                        active={currentTheme === key}
                        accent={t.accent}
                        data-name={`${t.emoji} ${t.name}`}
                        onClick={() => onChange(key)}
                        whileTap={{ scale: 0.9 }}
                    />
                ))}
            </ThemeGrid>
            <ActiveName>
                Theme: <span>{theme.emoji} {theme.name}</span>
            </ActiveName>
        </Wrapper>
    );
}
