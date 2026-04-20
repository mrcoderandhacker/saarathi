import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, ChevronLeft } from "lucide-react";

/* ---- STYLES ---- */
const FloatingBtn = styled(motion.button)`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: auto;
  height: 52px;
  padding: 0 1.5rem;
  border-radius: 999px;
  background: #111827;
  color: white;
  border: none;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: scale(1.05);
    background: #1f2937;
  }
`;

const ChatWidget = styled(motion.div)`
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  width: 90vw;
  max-width: 380px;
  height: 600px;
  max-height: 80vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    z-index: 2100;
  }
`;

const ChatHeader = styled.div`
  background: #0f172a;
  color: white;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 480px) {
    padding-top: calc(1.2rem + env(safe-area-inset-top));
  }
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0;
`;

const Status = styled.div`
  font-size: 0.75rem;
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  gap: 0.3rem;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
  }
`;

const ActionBtn = styled.button`
  background: transparent;
  color: white;
  border: none;
  cursor: pointer;
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.1); }
`;

const MobileBackBtn = styled(ActionBtn)`
  display: none;
  margin-right: 0.8rem;
  @media (max-width: 480px) {
    display: flex;
  }
`;

const CloseBtn = styled(ActionBtn)`
  color: rgba(255,255,255,0.6);
  &:hover { color: white; }
`;

const ChatBody = styled.div`
  flex: 1;
  padding: 1.2rem;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${p => p.isUser ? 'flex-end' : 'flex-start'};
`;

const Bubble = styled.div`
  max-width: 85%;
  padding: 0.8rem 1.1rem;
  border-radius: ${p => p.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'};
  background: ${p => p.isUser ? '#111827' : 'white'};
  color: ${p => p.isUser ? 'white' : '#1f2937'};
  border: ${p => p.isUser ? 'none' : '1px solid #e2e8f0'};
  box-shadow: ${p => p.isUser ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'};
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 4px;
  padding: 0.5rem;
  span {
    width: 6px;
    height: 6px;
    background: #9ca3af;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  span:nth-child(1) { animation-delay: -0.32s; }
  span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const InputArea = styled.form`
  padding: 1rem;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 0.6rem;
  align-items: flex-end;
  
  @media (max-width: 480px) {
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
`;

const Input = styled.textarea`
  flex: 1;
  background: #f1f5f9;
  border: 1px solid transparent;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  outline: none;
  resize: none;
  max-height: 120px;
  min-height: 44px;
  font-family: inherit;
  transition: all 0.2s;
  
  &:focus {
    border-color: #6366f1;
    background: white;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }
`;

const SendBtn = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${p => p.disabled ? '#e2e8f0' : '#111827'};
  color: ${p => p.disabled ? '#9ca3af' : 'white'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${p => p.disabled ? 'not-allowed' : 'pointer'};
  flex-shrink: 0;
  transition: background 0.2s;

  &:hover:not(:disabled) { background: #1f2937; transform: translateY(-1px); }
`;

/* ---- CONSTANTS ---- */
const SYSTEM_PROMPT = `You are the Saarathii AI Guide, a personal mentor for Indian students. 
Keep responses short, encouraging, and structured (use bullet points if helpful). 
You help them figure out career paths, exam prep (like boards, JEE, NEET, CUET), routines, and study strategies. 
Be empathetic to the pressure Indian students face. Do not use markdown headers, just bold text and lists.`;

const INITIAL_MSG = {
  role: "assistant",
  content: "Hi! I'm your Saarathii AI Guide. How can I help you today? Whether it's sorting out a study routine, choosing a career path, or just dealing with exam stress — I'm here."
};

export default function AIGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  // Auto-scroll to bottom 
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle browser back button to close chat
  useEffect(() => {
    if (isOpen) {
      // Add a dummy history entry so back button can be intercepted
      window.history.pushState({ chatOpen: true }, "");
      
      const handlePopState = (e) => {
        // When user hits back, close the chat
        setIsOpen(false);
      };

      window.addEventListener("popstate", handlePopState);
      
      // Disable body scroll when chat is full-screen on mobile
      if (window.innerWidth <= 480) {
        document.body.style.overflow = 'hidden';
      }

      return () => {
        window.removeEventListener("popstate", handlePopState);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const closeChat = () => {
    setIsOpen(false);
    // If we pushed a state, go back to clean it up
    if (window.history.state?.chatOpen) {
      window.history.back();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    const newMsg = { role: "user", content: userText };
    setMessages(prev => [...prev, newMsg]);
    setIsLoading(true);

    try {
      const proxyUrl = import.meta.env.VITE_SUPABASE_URL + "/ai";

      const payload = {
        system_instruction: { parts: { text: SYSTEM_PROMPT } },
        contents: [...messages, newMsg].map(m => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        })),
        generationConfig: {
          temperature: 0.7,
        }
      };

      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to fetch from Gemini");

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that. Try asking again in a different way.";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I'm having trouble connecting right now. Please check your internet or try again later."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <FloatingBtn
            key="btn"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles size={20} style={{ marginRight: "8px" }} />
            <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>Talk to Saarathii AI</span>
          </FloatingBtn>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <ChatWidget
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <ChatHeader>
              <HeaderInfo>
                <MobileBackBtn onClick={closeChat}>
                  <ChevronLeft size={24} />
                </MobileBackBtn>
                <Avatar><Sparkles size={18} /></Avatar>
                <TitleBlock>
                  <Title>Saarathii Guide</Title>
                  <Status>Online</Status>
                </TitleBlock>
              </HeaderInfo>
              <CloseBtn onClick={closeChat}>
                <X size={20} />
              </CloseBtn>
            </ChatHeader>

            <ChatBody>
              {messages.map((m, i) => (
                <MessageRow key={i} isUser={m.role === "user"}>
                  <Bubble isUser={m.role === "user"}>{m.content}</Bubble>
                </MessageRow>
              ))}

              {isLoading && (
                <MessageRow isUser={false}>
                  <Bubble isUser={false}>
                    <TypingIndicator><span></span><span></span><span></span></TypingIndicator>
                  </Bubble>
                </MessageRow>
              )}
              <div ref={endRef} />
            </ChatBody>

            <InputArea onSubmit={handleSubmit}>
              <Input
                placeholder="Ask your mentor anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <SendBtn type="submit" disabled={!input.trim() || isLoading}>
                <Send size={18} />
              </SendBtn>
            </InputArea>
          </ChatWidget>
        )}
      </AnimatePresence>
    </>
  );
}
