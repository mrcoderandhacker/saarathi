import styled from "styled-components";

/* ------------------ STYLES ------------------ */

const Wrapper = styled.div`
  width: 100%;
  max-width: 520px;
  margin-bottom: 2.5rem;
`;

const TextRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.6rem;
`;

const StepText = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
`;

const PercentageText = styled.span`
  font-size: 0.85rem;
  color: #6b7280;
`;

const BarBackground = styled.div`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background: #111827;
  border-radius: 999px;
  transition: width 0.4s ease;
`;

/* ------------------ COMPONENT ------------------ */

export default function ProgressBar({ currentStep, totalSteps }) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <Wrapper>
      <TextRow>
        <StepText>
          Step {currentStep} of {totalSteps}
        </StepText>
        <PercentageText>{percent}%</PercentageText>
      </TextRow>

      <BarBackground>
        <BarFill percent={percent} />
      </BarBackground>
    </Wrapper>
  );
}
