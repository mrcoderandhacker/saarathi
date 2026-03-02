import { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseDb as supabase } from "../../lib/supabase";

const barBounce = keyframes`
  0%, 100% { height: 4px; }
  50% { height: 100%; }
`;

const Panel = styled.div`
  background: ${p => p.panelBg || 'rgba(255,255,255,0.06)'};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectionTitle = styled.div`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
`;

const MusicModeToggle = styled.button`
  background: ${p => p.active ? p.accent : 'rgba(255,255,255,0.08)'};
  border: 1px solid ${p => p.active ? p.accent : 'rgba(255,255,255,0.1)'};
  color: ${p => p.active ? 'white' : 'rgba(255,255,255,0.5)'};
  border-radius: 8px;
  padding: 0.35rem 0.6rem;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const URLRow = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const URLInput = styled.input`
  flex: 1;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0.55rem 0.85rem;
  color: white;
  font-size: 0.82rem;
  outline: none;
  transition: border-color 0.2s;
  &::placeholder { color: rgba(255,255,255,0.3); }
  &:focus { border-color: ${p => p.accent || '#6366f1'}; }
`;

const PlayBtn = styled(motion.button)`
  background: ${p => p.accent || '#6366f1'};
  border: none;
  border-radius: 10px;
  padding: 0.55rem 1rem;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
`;

const EmbedWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: 14px;
  overflow: hidden;
  background: #000;

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
    transition: opacity 0.3s ease;
    ${p => p.musicMode && css`
      opacity: 0.01; /* Keep iframe loaded but invisible */
      pointer-events: none;
    `}
  }
`;

const VisualizerOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.95));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  z-index: 5;
  pointer-events: none;
  overflow: hidden;
`;

const softPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.3); opacity: 0.35; }
`;

const breathePulse = keyframes`
    0%, 100% { transform: scale(0.9); opacity: 0.05; }
    50% { transform: scale(1.5); opacity: 0.2; }
`;

const OrbWrap = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrbCore = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${p => p.accent};
  box-shadow: 0 0 30px ${p => p.accent}88;
  animation: ${softPulse} 4s ease-in-out infinite;
  z-index: 2;
`;

const OrbRing = styled.div`
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid ${p => p.accent}44;
  animation: ${breathePulse} 8s ease-in-out infinite;
`;

const VisualizerText = styled.div`
  color: rgba(255,255,255,0.4);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  animation: ${softPulse} 5s ease-in-out infinite alternate;
`;

const EmptyPlayer = styled.div`
  width: 100%;
  aspect-ratio: 16/9;
  background: rgba(0,0,0,0.3);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px dashed rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.3);
  font-size: 0.82rem;
  text-align: center;
  padding: 1rem;
`;

const CuratedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const CuratedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.4rem;
`;

const CuratedCard = styled(motion.button)`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 0.5rem 0.7rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }

  .c-emoji { font-size: 1rem; margin-bottom: 0.15rem; }
  .c-title { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.8); }
  .c-sub { font-size: 0.65rem; color: rgba(255,255,255,0.35); margin-top: 0.1rem; }
`;

const SavedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-height: 120px;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 999px; }
`;

const SavedItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.7);
  &:hover { background: rgba(255,255,255,0.08); color: white; }

  .si-thumb { 
    width: 36px; height: 24px; border-radius: 4px; object-fit: cover; flex-shrink: 0;
    background: rgba(255,255,255,0.08);
  }
  .si-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

const CURATED = [
  { emoji: '🎵', title: 'Lofi Girl', sub: 'Live stream', url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk' },
  { emoji: '⚡', title: 'Synthwave', sub: 'Focus beats', url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY' },
  { emoji: '📐', title: 'JEE Physics', sub: 'Concepts', url: 'https://www.youtube.com/watch?v=2LsHiZrRMEE' },
  { emoji: '🧪', title: 'Organic Chem', sub: 'Khan Academy', url: 'https://www.youtube.com/watch?v=zTUSiNI2E4w' },
  { emoji: '🌿', title: 'Nature Sounds', sub: 'Ambient', url: 'https://www.youtube.com/watch?v=eKFTSSKCzWA' },
  { emoji: '🎹', title: 'Piano Study', sub: 'Classical', url: 'https://www.youtube.com/watch?v=FhefMJMWMyc' },
];

function extractVideoId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    return u.searchParams.get('v');
  } catch {
    return null;
  }
}

export default function YouTubePlayer({ accent, panelBg, userId }) {
  const [input, setInput] = useState('');
  const [videoId, setVideoId] = useState(null);
  const [saved, setSaved] = useState([]);
  const [showCurated, setShowCurated] = useState(true);
  const [musicMode, setMusicMode] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase.from('study_playlists').select('*').eq('user_id', userId).order('added_at', { ascending: false })
      .then(({ data }) => setSaved(data || []));
  }, [userId]);

  const loadVideo = (url, title) => {
    const id = extractVideoId(url);
    if (!id) return;
    setVideoId(id);
    setShowCurated(false);

    if (userId) {
      supabase.from('study_playlists').upsert({
        user_id: userId, youtube_url: url,
        title: title || url, thumbnail: `https://img.youtube.com/vi/${id}/mqdefault.jpg`,
        added_at: new Date().toISOString()
      }).then(({ data }) => {
        if (data) setSaved(prev => [data[0], ...prev.filter(s => s.youtube_url !== url)]);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadVideo(input.trim(), input.trim());
    setInput('');
  };

  return (
    <Panel panelBg={panelBg}>
      <TopRow>
        <URLRow onSubmit={handleSubmit} style={{ flex: 1 }}>
          <URLInput
            accent={accent}
            placeholder="Paste a YouTube URL..."
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <PlayBtn type="submit" accent={accent} whileTap={{ scale: 0.95 }}>▶</PlayBtn>
        </URLRow>
      </TopRow>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
        <MusicModeToggle active={musicMode} accent={accent} onClick={() => setMusicMode(m => !m)}>
          {musicMode ? '🎧 Music Mode: ON' : '📺 Video Mode'}
        </MusicModeToggle>
      </div>

      {/* Player */}
      {videoId ? (
        <EmbedWrapper musicMode={musicMode}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />

          <AnimatePresence>
            {musicMode && (
              <VisualizerOverlay
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <OrbWrap>
                  <OrbRing accent={accent} style={{ animationDelay: '0s' }} />
                  <OrbRing accent={accent} style={{ animationDelay: '-4s', scale: 0.7 }} />
                  <OrbCore accent={accent} />
                </OrbWrap>
                <VisualizerText>Breathe & Focus</VisualizerText>
              </VisualizerOverlay>
            )}
          </AnimatePresence>
        </EmbedWrapper>
      ) : (
        <EmptyPlayer>
          <span style={{ fontSize: '2rem' }}>📺</span>
          Paste a YouTube URL above<br />or pick from curated content below
        </EmptyPlayer>
      )}

      {/* Curated */}
      <CuratedSection>
        <SectionTitle style={{ cursor: 'pointer' }} onClick={() => setShowCurated(s => !s)}>
          ⚡ Quick Play {showCurated ? '▲' : '▼'}
        </SectionTitle>
        <AnimatePresence>
          {showCurated && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
              <CuratedGrid>
                {CURATED.map(c => (
                  <CuratedCard key={c.url} onClick={() => loadVideo(c.url, c.title)} whileTap={{ scale: 0.97 }}>
                    <div className="c-emoji">{c.emoji}</div>
                    <div className="c-title">{c.title}</div>
                    <div className="c-sub">{c.sub}</div>
                  </CuratedCard>
                ))}
              </CuratedGrid>
            </motion.div>
          )}
        </AnimatePresence>
      </CuratedSection>

      {/* Saved playlists */}
      {saved.length > 0 && (
        <CuratedSection>
          <SectionTitle>🕐 Recently Watched</SectionTitle>
          <SavedList>
            {saved.map(s => (
              <SavedItem key={s.id} onClick={() => loadVideo(s.youtube_url, s.title)} whileTap={{ scale: 0.98 }}>
                <img className="si-thumb" src={s.thumbnail} alt="" />
                <span className="si-title">{s.title}</span>
              </SavedItem>
            ))}
          </SavedList>
        </CuratedSection>
      )}
    </Panel>
  );
}
