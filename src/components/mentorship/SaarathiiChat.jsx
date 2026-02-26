import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { sendMessageToSaarathii } from '../../services/geminiService';

/* ------------------ STYLED COMPONENTS ------------------ */

const ChatWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ChatContainer = styled.div`
  background: white;
  border-radius: ${props => props.isExpanded ? '0' : '32px'};
  padding: ${props => props.isExpanded ? '2rem 2rem 1rem 2rem' : '1.5rem'};
  border: 1px solid #f0f0f0;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  height: ${props => props.isExpanded ? '80vh' : '500px'};
  max-height: ${props => props.isExpanded ? '80vh' : '500px'};
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: ${props => props.isExpanded ? 'fixed' : 'relative'};
  top: ${props => props.isExpanded ? '50%' : 'auto'};
  left: ${props => props.isExpanded ? '50%' : 'auto'};
  transform: ${props => props.isExpanded ? 'translate(-50%, -50%)' : 'none'};
  width: ${props => props.isExpanded ? '90%' : '100%'};
  max-width: ${props => props.isExpanded ? '1200px' : '100%'};
  z-index: ${props => props.isExpanded ? '1000' : '1'};
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: ${props => props.isExpanded ? '90vh' : '450px'};
    padding: ${props => props.isExpanded ? '1.5rem 1rem' : '1.2rem'};
    width: ${props => props.isExpanded ? '95%' : '100%'};
  }
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: ${props => props.isVisible ? 'block' : 'none'};
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const ChatTitle = styled.div`
  flex: 1;
`;

const ChatName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #0a0a0a;
  margin-bottom: 0.1rem;
`;

const ChatStatus = styled.span`
  font-size: 0.7rem;
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.2rem;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    display: inline-block;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3f4f6;
    color: #8b5cf6;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding-right: 0.3rem;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  margin-bottom: 0.8rem;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

const MessageBubble = styled.div`
  max-width: 75%;
  padding: 0.8rem 1rem;
  border-radius: 18px;
  background: ${props => props.isUser ? '#8b5cf6' : '#f3f4f6'};
  color: ${props => props.isUser ? 'white' : '#0a0a0a'};
  font-size: 0.9rem;
  line-height: 1.5;
  word-wrap: break-word;
`;

const MessageTime = styled.span`
  font-size: 0.6rem;
  opacity: 0.6;
  margin-top: 0.2rem;
  display: block;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  background: #f9fafb;
  padding: 0.3rem;
  border-radius: 40px;
  border: 1px solid #e5e7eb;

  &:focus-within {
    border-color: #8b5cf6;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.7rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  outline: none;

  &::placeholder {
    color: #9ca3af;
    font-size: 0.85rem;
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const SendButton = styled.button`
  width: 38px;
  height: 38px;
  background: ${props => props.disabled ? '#cbd5e0' : '#8b5cf6'};
  border: none;
  border-radius: 50%;
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #7c3aed;
    transform: scale(1.05);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.3rem;
  padding: 0.8rem 1.2rem;
  background: #f3f4f6;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  width: fit-content;

  span {
    width: 6px;
    height: 6px;
    background: #8b5cf6;
    border-radius: 50%;
    animation: bounce 1.4s infinite;
  }

  span:nth-child(1) { animation-delay: -0.32s; }
  span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.8rem;
  margin: 0.3rem 0;
  padding: 0.5rem 0.8rem;
  background: #fee2e2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

/* ------------------ FLOATING SUGGEST BUTTON ------------------ */

const SuggestButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 40px;
  padding: 0.8rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
  transition: all 0.2s;
  z-index: 998;

  &:hover {
    background: #7c3aed;
    transform: translateY(-2px);
    box-shadow: 0 12px 25px rgba(139, 92, 246, 0.4);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SuggestionsModal = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  background: white;
  border-radius: 24px;
  padding: 1.2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  width: 300px;
  max-width: calc(100vw - 40px);
  z-index: 999;
  animation: slideUp 0.2s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SuggestionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #f0f0f0;
`;

const SuggestionsTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #0a0a0a;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #6b7280;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;

const SuggestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const SuggestionItem = styled.button`
  background: #f9fafb;
  border: 1px solid #f0f0f0;
  padding: 0.8rem 1rem;
  border-radius: 14px;
  font-size: 0.85rem;
  color: #374151;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1.4;

  &:hover {
    background: #f5f3ff;
    border-color: #8b5cf6;
    color: #8b5cf6;
  }
`;

/* ------------------ MAIN COMPONENT ------------------ */

export default function SaarathiiChat() {
  const [messages, setMessages] = useState([
    {
      text: "Namaste! 🙏 I'm Saarathii, your career mentor. What grade are you in?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track user interaction

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Quick suggestions
  const suggestions = [
    "I'm in 9th, confused between PCM and PCB",
    "How to start JEE prep from 11th?",
    "I love music and acting, what to do?",
    "Tips for NEET in 12th",
    "Commerce vs Arts?",
    "Multiple interests, help!",
    "Best film schools in India?",
    "How to manage board exams?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // FIXED: Only focus when user has interacted with the chat
  useEffect(() => {
    // Only focus if user has explicitly interacted AND chat is not expanded
    if (hasUserInteracted && !isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded, hasUserInteracted]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key to close expanded view
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isExpanded]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const response = await sendMessageToSaarathii(input, messages);

      const aiMessage = {
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setShowSuggestions(false);
    } catch (err) {
      setError(err.message || "Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setShowSuggestions(false);
    setHasUserInteracted(true); // Mark that user has interacted
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    setMessages([{
      text: "Namaste! 🙏 I'm Saarathii, your career mentor. What grade are you in?",
      isUser: false,
      timestamp: new Date()
    }]);
    setError("");
    setHasUserInteracted(false); // Reset interaction state
  };

  // Handle input click to mark interaction
  const handleInputClick = () => {
    setHasUserInteracted(true);
  };

  // Handle expand toggle with interaction tracking
  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setHasUserInteracted(true); // User wants to expand, so they're interacting
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <ChatWrapper>
        <Overlay isVisible={isExpanded} onClick={() => setIsExpanded(false)} />

        <ChatContainer isExpanded={isExpanded}>
          <ChatHeader>
            <Avatar>🧘</Avatar>
            <ChatTitle>
              <ChatName>Saarathii</ChatName>
              <ChatStatus>Online</ChatStatus>
            </ChatTitle>
            <HeaderActions>
              <IconButton onClick={() => setShowSuggestions(true)} title="Suggestions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12h8M8 8h4M8 16h6" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </IconButton>
              <IconButton onClick={handleExpandToggle} title={isExpanded ? "Minimize" : "Expand"}>
                {isExpanded ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 14H4M20 10H4" />
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M14 10l6-6M3 15h6v6M10 14l-6 6" />
                  </svg>
                )}
              </IconButton>
              <IconButton onClick={handleClearChat} title="Clear chat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </IconButton>
            </HeaderActions>
          </ChatHeader>

          <MessagesContainer>
            {messages.map((msg, index) => (
              <MessageWrapper key={index} isUser={msg.isUser}>
                <MessageBubble isUser={msg.isUser}>
                  {msg.text}
                  <MessageTime isUser={msg.isUser}>
                    {formatTime(msg.timestamp || new Date())}
                  </MessageTime>
                </MessageBubble>
              </MessageWrapper>
            ))}

            {loading && (
              <MessageWrapper isUser={false}>
                <TypingIndicator>
                  <span></span>
                  <span></span>
                  <span></span>
                </TypingIndicator>
              </MessageWrapper>
            )}

            {error && (
              <ErrorMessage>
                <span>⚠️</span>
                {error}
              </ErrorMessage>
            )}

            <div ref={messagesEndRef} />
          </MessagesContainer>

          <InputContainer>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              onClick={handleInputClick} // Track click interaction
              placeholder="Type your question..."
              disabled={loading}
            />
            <SendButton
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </SendButton>
          </InputContainer>
        </ChatContainer>
      </ChatWrapper>

      {/* Floating Suggest Button */}
      {!showSuggestions && (
        <SuggestButton onClick={() => setShowSuggestions(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" strokeWidth="3" />
          </svg>
          Ask Saarathii AI
        </SuggestButton>
      )}

      {/* Suggestions Modal */}
      {showSuggestions && (
        <SuggestionsModal ref={modalRef}>
          <SuggestionsHeader>
            <SuggestionsTitle>Quick Questions</SuggestionsTitle>
            <CloseButton onClick={() => setShowSuggestions(false)}>
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </CloseButton>
          </SuggestionsHeader>
          <SuggestionList>
            {suggestions.map((suggestion, index) => (
              <SuggestionItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </SuggestionItem>
            ))}
          </SuggestionList>
        </SuggestionsModal>
      )}
    </>
  );
}