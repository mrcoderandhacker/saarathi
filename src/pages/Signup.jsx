import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SignupQuestion from "../components/signup/SignupQuestion";
import ProgressBar from "../components/signup/ProgressBar";

/* ------------------ STYLES ------------------ */

const Layout = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  max-width: 520px;
  width: 100%;
`;

const Title = styled.h1`
  font-family: "Playfair Display", serif;
  font-size: 2.5rem;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  color: #6b7280;
`;

/* ------------------ QUESTIONS ------------------ */

const QUESTIONS = [
  {
    id: "stage",
    question: "Which stage are you currently in?",
    options: ["Class 10", "Class 11", "Class 12", "Drop Year"],
  },
  {
    id: "exam",
    question: "What are you preparing for?",
    options: ["JEE", "NEET", "CET", "CUET", "Not sure yet"],
  },
  {
    id: "state",
    question: "How are you feeling right now?",
    options: [
      "Confident, but need guidance",
      "Confused and overwhelmed",
      "Stressed about decisions",
      "Just exploring options",
    ],
  },
  {
    id: "need",
    question: "What do you need most right now?",
    options: [
      "Academic planning",
      "Counselling & college decisions",
      "Motivation & mental clarity",
      "All of the above",
    ],
  },
  {
    id: "phone",
    question: "Your contact number",
    type: "phone",
    placeholder: "Enter 10-digit mobile number",
  },
  {
    id: "whatsapp",
    question: "Your WhatsApp number",
    type: "whatsapp",
    placeholder: "Enter 10-digit WhatsApp number",
  },
];

/* ------------------ COMPONENT ------------------ */

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortControllerRef = useRef(null);

  const currentQuestion = QUESTIONS[step];

  // Cleanup function to abort pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSelect = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    // Move to next step smoothly
    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 250);
  };

  const handleInputSubmit = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));

    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 250);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      // Save to localStorage first
      localStorage.setItem(
        "saarathi_onboarding",
        JSON.stringify(answers)
      );
      
      console.log("Collected answers:", answers);
      
      // Navigate without waiting
      navigate("/auth");
      
    } catch (error) {
      console.error("Error saving data:", error);
      
      // Still navigate even if there's an error
      navigate("/auth");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final step - account creation
  if (step >= QUESTIONS.length) {
    return (
      <Layout>
        <Header>
          <Title>Saarathi</Title>
          <Subtitle>Your personal academic guide</Subtitle>
        </Header>
        
        <SignupQuestion
          question="You're all set ✨"
          options={["Create my Saarathi account"]}
          value={null}
          onSelect={handleFinalSubmit}
          disabled={isSubmitting}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Header>
        <Title>Saarathi</Title>
        <Subtitle>Your personal academic guide</Subtitle>
      </Header>
      
      <ProgressBar
        currentStep={step + 1}
        totalSteps={QUESTIONS.length}
      />
      
      <SignupQuestion
        question={currentQuestion.question}
        options={currentQuestion.options || []}
        type={currentQuestion.type}
        placeholder={currentQuestion.placeholder}
        value={answers[currentQuestion.id]}
        answers={answers}
        onSelect={handleSelect}
        onSubmit={currentQuestion.type ? handleInputSubmit : undefined}
      />
    </Layout>
  );
}