import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedName() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    // Smooth typewriter effect for "Saarathi"
    const fullText = "Saarathi";
    let currentIndex = 0;
    
    const typeWriter = () => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.substring(0, currentIndex));
        currentIndex++;
        setTimeout(typeWriter, 120); // Faster typing for smoother feel
      } else {
        // After typing is complete, keep it visible
        setTimeout(() => setIsAnimating(false), 600);
      }
    };

    typeWriter();
  }, []);

  // Letter animations for the final state
  const letters = "Saarathi".split("");
  
  // Animation variants for each letter
  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      }
    }
  };

  const letterVariants = {
    initial: { 
      opacity: 0,
      y: 12, // Reduced y movement
      scale: 0.85,
    },
    animate: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 180,
        delay: i * 0.04,
      }
    })
  };

  return (
    <div style={{ 
      position: "relative",
      marginTop: "0.5rem",
      height: "45px", // Reduced height for smaller font
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Always visible container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "relative",
        }}
      >
        {isAnimating ? (
          // Typewriter phase
          <motion.h1
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.1rem", // 25% smaller (from 2.8rem)
              color: "#111827",
              fontWeight: 700,
              letterSpacing: "0.08em",
              lineHeight: 1,
            }}
          >
            {displayText}
            {/* Only show blinking cursor during typing */}
            {displayText.length < 8 && (
              <motion.span
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                style={{
                  color: "#111827",
                  marginLeft: "1px",
                  opacity: 0.8,
                }}
              >
                |
              </motion.span>
            )}
          </motion.h1>
        ) : (
          // Final state - stays visible with spring animation
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            style={{
              display: "flex",
              position: "relative",
            }}
          >
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={letterVariants}
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "2.1rem", // 25% smaller (from 2.8rem)
                  color: "#111827",
                  fontWeight: 700,
                  textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  position: "relative",
                  display: "inline-block",
                  lineHeight: 1,
                }}
              >
                {letter}
              </motion.span>
            ))}
            
            {/* Subtle shine effect */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 1.2,
                delay: 0.4,
                ease: "easeInOut"
              }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "40%",
                height: "100%",
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(255, 255, 255, 0.2) 50%, 
                  transparent 100%)`,
                transform: "skewX(-15deg)",
                opacity: 0.7,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}