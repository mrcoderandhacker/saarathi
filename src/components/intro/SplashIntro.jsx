import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../../resources/logo.png";
import AnimatedName from "./AnimatedName";

export default function SplashIntro({ onFinish }) {
  const [zoomPhase, setZoomPhase] = useState(-1); // -1: appear, 0: initial, 1: gather, 2: zoom, 3: complete

  useEffect(() => {
    const timeline = [
      // Logo appears from center (reverse of zoom)
      setTimeout(() => setZoomPhase(0), 1000), // After logo appears
      
      // Initial display: 2 seconds after logo appears
      setTimeout(() => setZoomPhase(1), 3000), // Start gather effect
      setTimeout(() => setZoomPhase(2), 3500), // Start zoom
      setTimeout(() => setZoomPhase(3), 5000), // Zoom complete
      setTimeout(onFinish, 5500), // Transition to home
    ];

    return () => timeline.forEach(t => clearTimeout(t));
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* REVERSE ZOOM EFFECT FOR LOGO APPEARANCE */}
      {zoomPhase === -1 && (
        <>
          {/* White radial wipe (reverse) */}
          <motion.div
            initial={{ clipPath: "circle(150% at 50% 50%)" }}
            animate={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ 
              duration: 1.2,
              ease: [0.87, 0, 0.13, 1],
            }}
            style={{
              position: "absolute",
              inset: 0,
              background: "white",
              zIndex: 5,
            }}
          />
          
          {/* Reverse tunnel effect */}
          <motion.div
            initial={{ scale: 50, opacity: 0, borderRadius: "0%" }}
            animate={{ 
              scale: 0.1, 
              opacity: [0, 1, 1, 0],
              borderRadius: ["0%", "0%", "100%", "100%"],
            }}
            transition={{ 
              duration: 1.2,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100px",
              height: "100px",
              background: "linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6)", // Reverse gradient
              zIndex: 4,
              mixBlendMode: "screen",
            }}
          />
          
          {/* Reverse particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: window.innerWidth / 2 + Math.cos(i * 45 * Math.PI/180) * 200,
                y: window.innerHeight / 2 + Math.sin(i * 45 * Math.PI/180) * 200,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 1,
                delay: (7 - i) * 0.1, // Reverse order
                ease: "easeIn",
              }}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: `linear-gradient(45deg, 
                  hsl(${270 + i * 15}, 70%, 60%), 
                  hsl(${210 + i * 15}, 70%, 60%))`, // Reverse gradient
                zIndex: 3,
              }}
            />
          ))}
        </>
      )}

      {/* Animated background particles for gather phase */}
      {zoomPhase >= 1 && (
        <>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: 0,
                opacity: 0,
              }}
              animate={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: [0, 1, 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: `hsl(${210 + i * 10}, 70%, 65%)`,
                zIndex: 1,
              }}
            />
          ))}
        </>
      )}

      {/* Main content container */}
      <div style={{
        position: "relative",
        zIndex: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* LOGO with elegant appear and zoom */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: zoomPhase === -1 ? 0.1 : 
                   zoomPhase === 0 ? 1 : 
                   zoomPhase === 1 ? 1.1 : 
                   zoomPhase === 2 ? 0 : 0,
            opacity: zoomPhase === -1 ? 0 : 
                     zoomPhase === 0 ? 1 : 
                     zoomPhase === 1 ? 1 : 
                     zoomPhase === 2 ? 0 : 0,
            y: zoomPhase === -1 ? 0 : 
               zoomPhase === 0 ? 0 : 
               zoomPhase === 1 ? -5 : 0,
            rotate: zoomPhase === 1 ? 5 : 0,
          }}
          transition={{ 
            duration: zoomPhase === -1 ? 1.2 : 
                     zoomPhase === 1 ? 0.8 : 
                     zoomPhase === 2 ? 1.5 : 0.8,
            ease: zoomPhase === -1 ? [0.87, 0, 0.13, 1] : 
                  zoomPhase === 1 ? "easeOut" : 
                  zoomPhase === 2 ? [0.87, 0, 0.13, 1] : 
                  [0.34, 1.56, 0.64, 1],
          }}
          style={{
            marginBottom: "20px",
            position: "relative",
            filter: zoomPhase === 1 ? "drop-shadow(0 20px 30px rgba(59, 130, 246, 0.3))" : "none",
          }}
        >
          {/* Glow effect during gather phase */}
          {zoomPhase === 1 && (
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1.3, opacity: 0.4 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                inset: "-15px",
                borderRadius: "30px",
                background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)",
                zIndex: -1,
              }}
            />
          )}

          <img
            src={logo}
            alt="Saarathi Logo"
            style={{
              width: 96,
              height: 96,
              borderRadius: "18px",
              background: "white",
              padding: "8px",
              boxShadow: `
                0 10px 24px rgba(0,0,0,0.15),
                0 4px 8px rgba(0,0,0,0.1),
                inset 0 1px 1px rgba(255,255,255,0.6)
              `,
              border: "1px solid rgba(0,0,0,0.08)",
              objectFit: "contain",
              display: "block",
            }}
          />
        </motion.div>

        {/* NAME appears after logo */}
        {zoomPhase >= 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: zoomPhase === 0 ? 1 : 
                       zoomPhase === 1 ? 1 : 
                       zoomPhase === 2 ? 0 : 0,
              scale: zoomPhase === 0 ? 1 : 
                     zoomPhase === 1 ? 1.05 : 
                     zoomPhase === 2 ? 0 : 0,
              y: zoomPhase === 1 ? -5 : 0,
            }}
            transition={{ 
              duration: zoomPhase === 0 ? 0.6 : 
                       zoomPhase === 2 ? 1.5 : 0.5,
              delay: zoomPhase === 0 ? 0.3 : 0,
              ease: zoomPhase === 0 ? [0.34, 1.56, 0.64, 1] : 
                    zoomPhase === 2 ? [0.87, 0, 0.13, 1] : "easeOut",
            }}
            style={{
              position: "relative",
            }}
          >
            <AnimatedName />
          </motion.div>
        )}
      </div>

      {/* Zoom tunnel effect (outward) */}
      {zoomPhase === 2 && (
        <motion.div
          initial={{ scale: 0.1, opacity: 0, borderRadius: "100%" }}
          animate={{ 
            scale: 50, 
            opacity: [0, 1, 1, 0],
            borderRadius: ["100%", "100%", "0%", "0%"],
          }}
          transition={{ 
            duration: 1.5,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100px",
            height: "100px",
            background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)",
            zIndex: 3,
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* Radial wipe effect (outward) */}
      {zoomPhase === 2 && (
        <motion.div
          initial={{ clipPath: "circle(0% at 50% 50%)" }}
          animate={{ clipPath: "circle(150% at 50% 50%)" }}
          transition={{ 
            duration: 1.2,
            delay: 0.3,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            inset: 0,
            background: "white",
            zIndex: 4,
          }}
        />
      )}

      {/* Floating particles during zoom (outward) */}
      {zoomPhase === 2 && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 1,
                opacity: 0.8,
              }}
              animate={{
                x: window.innerWidth / 2 + Math.cos(i * 45 * Math.PI/180) * 200,
                y: window.innerHeight / 2 + Math.sin(i * 45 * Math.PI/180) * 200,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: `linear-gradient(45deg, 
                  hsl(${210 + i * 15}, 70%, 60%), 
                  hsl(${270 + i * 15}, 70%, 60%))`,
                zIndex: 1,
              }}
            />
          ))}
        </>
      )}

      {/* Ambient light pulses */}
      <motion.div
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />
    </motion.div>
  );
}