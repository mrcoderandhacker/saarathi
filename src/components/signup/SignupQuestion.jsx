import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Card = styled(motion.div)`
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.06);
  max-width: 520px;
  width: 100%;
`;

const Question = styled.h2`
  font-family: "Playfair Display", serif;
  font-size: 1.6rem;
  color: #111827;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: ${({ $hasInput }) => ($hasInput ? "1.5rem" : "0")};
`;

const Option = styled.button`
  background: ${({ selected }) => (selected ? "#111827" : "#f9fafb")};
  color: ${({ selected }) => (selected ? "#ffffff" : "#111827")};
  border: 1px solid #e5e7eb;
  padding: 0.9rem 1.2rem;
  border-radius: 0.9rem;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;

  &:hover {
    background: ${({ selected }) =>
      selected ? "#1f2937" : "#f3f4f6"};
  }
`;

const PhoneInputWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const CountryCode = styled.span`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const PhoneInput = styled.input`
  width: 100%;
  padding: 0.9rem 1.2rem 0.9rem 3.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.9rem;

  &:focus {
    outline: none;
    border-color: #111827;
  }

  &:disabled {
    background: #f3f4f6;
  }
`;

const ContinueButton = styled.button`
  width: 100%;
  background: ${({ disabled }) =>
    disabled ? "#e5e7eb" : "#111827"};
  color: ${({ disabled }) =>
    disabled ? "#9ca3af" : "#ffffff"};
  border: none;
  padding: 0.9rem;
  border-radius: 0.9rem;
  cursor: ${({ disabled }) =>
    disabled ? "not-allowed" : "pointer"};
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

const SameAsPhone = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const SuccessIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const FinalMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
`;

/* ------------------ COMPONENT ------------------ */

export default function SignupQuestion({
  question,
  options = [],
  type,
  placeholder,
  value,
  answers,
  onSelect,
  onSubmit,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [sameAsPhone, setSameAsPhone] = useState(false);
  const autoSubmitRef = useRef(false);

  useEffect(() => {
    setInputValue("");
    setIsValid(false);
    setSameAsPhone(false);
    autoSubmitRef.current = false;
  }, [question]);

  useEffect(() => {
    if (type === "phone" || type === "whatsapp") {
      const digits = inputValue.replace(/\D/g, "");
      setIsValid(/^[6-9]\d{9}$/.test(digits));
    }
  }, [inputValue, type]);

  const handleSubmit = () => {
    if (!isValid || !onSubmit) return;
    onSubmit(inputValue.replace(/\D/g, ""));
  };

  /* ---------- FINAL CTA ---------- */
  if (question === "You're all set ✨") {
    return (
      <Card>
        <SuccessIcon>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="32" fill="#111827" />
            <path
              d="M22 32L30 40L42 26"
              stroke="white"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </SuccessIcon>

        <Question style={{ textAlign: "center" }}>{question}</Question>
        <FinalMessage>
          We’re ready to create your Saarathi journey.
        </FinalMessage>

        <Options $hasInput={false}>
          {options.map((option) => (
            <Option key={option} onClick={() => onSelect(option)}>
              {option}
            </Option>
          ))}
        </Options>
      </Card>
    );
  }

  /* ---------- PHONE / WHATSAPP ---------- */
  if (type === "phone" || type === "whatsapp") {
    return (
      <Card>
        <Question>{question}</Question>
        <Subtitle>
          {type === "phone"
            ? "We’ll use this to contact you"
            : "We’ll send important updates here"}
        </Subtitle>

        <PhoneInputWrapper>
          <CountryCode>+91</CountryCode>
          <PhoneInput
            value={inputValue}
            placeholder={placeholder}
            disabled={type === "whatsapp" && sameAsPhone}
            onChange={(e) =>
              setInputValue(e.target.value.replace(/\D/g, ""))
            }
          />
        </PhoneInputWrapper>

        {type === "whatsapp" && answers?.phone && (
          <SameAsPhone>
            <input
              type="checkbox"
              checked={sameAsPhone}
              onChange={() => {
                setSameAsPhone(!sameAsPhone);
                setInputValue(
                  !sameAsPhone ? answers.phone : ""
                );
              }}
            />
            Same as contact number
          </SameAsPhone>
        )}

        {inputValue && !isValid && (
          <ErrorMessage>
            Enter a valid 10-digit number
          </ErrorMessage>
        )}

        <ContinueButton disabled={!isValid} onClick={handleSubmit}>
          Continue
        </ContinueButton>
      </Card>
    );
  }

  /* ---------- MCQ ---------- */
  return (
    <Card>
      <Question>{question}</Question>
      <Options $hasInput={false}>
        {options.map((option) => (
          <Option
            key={option}
            selected={value === option}
            onClick={() => onSelect(option)}
          >
            {option}
          </Option>
        ))}
      </Options>
    </Card>
  );
}
