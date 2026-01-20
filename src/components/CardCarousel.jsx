import { useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ------------------ STYLES ------------------ */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const CarouselArea = styled.div`
  position: relative;
  width: 100%;
  min-width: 260px;
  min-height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    min-width: 340px;
    min-height: 340px;
  }
`;

const Card = styled(motion.div)`
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 1.2rem;
  background-size: cover;
  background-position: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border: 3px solid white;

  @media (min-width: 768px) {
    width: 280px;
    height: 280px;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ControlButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

/* ------------------ COMPONENT ------------------ */

export default function CardCarousel({
  images = [
    "/images/mentorship.jpg",
    "/images/students.jpg",
    "/images/guidance.jpg",
  ],
}) {
  const [index, setIndex] = useState(1);

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getStyle = (i) => {
    const position = (i - index + images.length) % images.length;
    const normalized = position > 1 ? position - images.length : position;

    return {
      x: normalized * 90,
      rotate: normalized * 4,
      scale: normalized === 0 ? 1 : 0.92,
      zIndex: normalized === 0 ? 2 : 1,
      filter: normalized === 0 ? "blur(0px)" : "blur(1px)",
      opacity: Math.abs(normalized) > 1 ? 0 : 1,
    };
  };

  return (
    <Wrapper>
      <CarouselArea>
        {images.map((img, i) => (
          <Card
            key={i}
            animate={getStyle(i)}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 26,
            }}
            style={{ backgroundImage: `url(${img})` }}
            aria-hidden={i !== index}
          />
        ))}
      </CarouselArea>

      <Controls>
        <ControlButton onClick={handlePrev} aria-label="Previous">
          <ChevronLeft size={18} />
        </ControlButton>
        <ControlButton onClick={handleNext} aria-label="Next">
          <ChevronRight size={18} />
        </ControlButton>
      </Controls>
    </Wrapper>
  );
}
