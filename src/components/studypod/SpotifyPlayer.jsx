import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Panel = styled.div`
  background: ${p => p.panelBg || 'rgba(255,255,255,0.06)'};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  position: relative;
  overflow: hidden;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

const InputForm = styled.form`
  display: flex;
  gap: 0.4rem;
  align-items: stretch;
`;

const Input = styled.input`
  flex: 1;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  color: white;
  font-size: 0.8rem;
  outline: none;
  transition: border-color 0.2s;
  
  &::placeholder { color: rgba(255,255,255,0.25); }
  &:focus { border-color: ${p => p.accent}; }
`;

const SubmitBtn = styled(motion.button)`
  background: ${p => p.accent};
  border: none;
  border-radius: 10px;
  padding: 0 1rem;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
`;

const IframeWrapper = styled.div`
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.05);
  position: relative;
`;

const Frame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  position: absolute;
  top: 0; left: 0;
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  text-align: center;
`;

const DEFAULT_PLAYLIST = "https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM";

export default function SpotifyPlayer({ accent, panelBg }) {
    const [urlInput, setUrlInput] = useState("");
    const [embedUrl, setEmbedUrl] = useState(() => {
        return localStorage.getItem("saarathi_spotify_url") || DEFAULT_PLAYLIST;
    });
    const [error, setError] = useState("");

    useEffect(() => {
        localStorage.setItem("saarathi_spotify_url", embedUrl);
    }, [embedUrl]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!urlInput.trim()) return;

        // Extract spotify ID & Type (playlist, album, track)
        // e.g. https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS?si=...
        try {
            const urlObj = new URL(urlInput.trim());
            if (urlObj.hostname !== "open.spotify.com") {
                setError("Please paste a valid open.spotify.com link.");
                return;
            }

            const path = urlObj.pathname; // e.g. /playlist/1234
            setEmbedUrl(`https://open.spotify.com/embed${path}?utm_source=generator&theme=0`);
            setUrlInput("");
        } catch {
            setError("Invalid URL format.");
        }
    };

    // Transform default url to embed url if needed
    const getEmbedSrc = () => {
        if (embedUrl.includes("/embed/")) return embedUrl;

        try {
            const path = new URL(embedUrl).pathname;
            return `https://open.spotify.com/embed${path}?utm_source=generator&theme=0`;
        } catch {
            return `https://open.spotify.com/embed/playlist/0vvXsWCC9xrXsKd4FyS8kM?utm_source=generator&theme=0`;
        }
    };

    return (
        <Panel panelBg={panelBg}>
            <HeaderRow>
                <Title>
                    <span style={{ color: '#1DB954', fontSize: '1.1rem' }}>🎧</span>
                    Spotify Player
                </Title>
            </HeaderRow>

            <InputForm onSubmit={handleSubmit}>
                <Input
                    placeholder="Paste a Spotify Playlist / Track link..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    accent={accent}
                />
                <SubmitBtn type="submit" accent={accent} whileTap={{ scale: 0.95 }}>
                    Load
                </SubmitBtn>
            </InputForm>

            {error && <ErrorMsg>{error}</ErrorMsg>}

            <IframeWrapper>
                <Frame
                    src={getEmbedSrc()}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            </IframeWrapper>
        </Panel>
    );
}
