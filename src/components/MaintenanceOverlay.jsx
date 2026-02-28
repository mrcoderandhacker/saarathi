import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const orbit = keyframes`
  from { transform: rotate(0deg) translateX(90px) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  text-align: center;
  padding: 2rem;
`;

const OrbitWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 2.5rem;
`;

const CenterCircle = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  width: 70px; height: 70px;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  box-shadow: 0 0 40px rgba(99,102,241,0.6);
`;

const Dot = styled.div`
  position: absolute;
  top: 50%; left: 50%;
  width: 14px; height: 14px;
  border-radius: 50%;
  margin: -7px;
  background: ${p => p.color || '#a78bfa'};
  animation: ${orbit} ${p => p.duration || '3s'} linear infinite;
  animation-delay: ${p => p.delay || '0s'};
  box-shadow: 0 0 10px ${p => p.color || '#a78bfa'};
`;

const Title = styled.h1`
  font-size: clamp(1.6rem, 5vw, 2.5rem);
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255,255,255,0.6);
  max-width: 420px;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.3);
  border-radius: 999px;
  padding: 0.5rem 1.2rem;
  color: #a78bfa;
  font-size: 0.85rem;
  font-weight: 600;
`;

const Blink = styled.span`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #a78bfa;
  display: inline-block;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const Logo = styled.div`
  position: absolute;
  top: 1.5rem; left: 50%;
  transform: translateX(-50%);
  font-weight: 800;
  font-size: 1.3rem;
  color: white;
  letter-spacing: -0.02em;
`;

export default function MaintenanceOverlay({ message }) {
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Logo>Saarathii ✦</Logo>

      <OrbitWrapper>
        <CenterCircle>🛠️</CenterCircle>
        <Dot color="#6366f1" duration="3s" delay="0s" />
        <Dot color="#a78bfa" duration="4.5s" delay="-1.5s" />
        <Dot color="#818cf8" duration="6s" delay="-3s" />
      </OrbitWrapper>

      <Title>We're Upgrading Saarathii</Title>
      <Subtitle>
        {message || "Our team is working hard to bring you new features. We'll be back very soon!"}
      </Subtitle>

      <StatusPill>
        <Blink /> Active Development · Back Soon
      </StatusPill>
    </Overlay>
  );
}

export function useMaintenanceMode() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // ✅ Always bypass on localhost so you can develop freely
  const isLocalhost = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (isLocalhost) {
      setLoading(false);
      return; // Skip Supabase check entirely when developing locally
    }

    const check = async () => {
      const { data } = await supabase
        .from('site_config')
        .select('maintenance_mode, maintenance_message')
        .eq('id', 1)
        .single();

      setIsMaintenance(data?.maintenance_mode ?? false);
      setMessage(data?.maintenance_message ?? '');
      setLoading(false);
    };

    check();

    // Real-time subscription — flips instantly when you toggle in Supabase
    const channel = supabase
      .channel('site_config_changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'site_config' }, (payload) => {
        setIsMaintenance(payload.new.maintenance_mode);
        setMessage(payload.new.maintenance_message);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [isLocalhost]);

  return { isMaintenance, message, loading };
}
