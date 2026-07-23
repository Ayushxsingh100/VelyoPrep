import React, { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { VeyloPrepLogo } from "../../shared/components/logo/VeyloPrepLogo";

interface SplashScreenProps {
  isDark: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isDark }) => {
  const shouldReduceMotion = useReducedMotion();
  const [entranceDone, setEntranceDone] = useState(false);

  // Logo entrance spring animation variants (low stiffness for a smooth, slow settle)
  const logoContainerVariants = {
    initial: shouldReduceMotion 
      ? { opacity: 0 } 
      : { scale: 0.15, rotate: -65, opacity: 0 },
    animate: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 42,   // Slower settle
        damping: 9.5,    // Smooth slide without sharp bounces
        mass: 1,
        opacity: { duration: 0.7, ease: "easeOut" }
      }
    }
  };

  // Continuous micro-float (only starts after entrance completes to prevent axial fight stutters)
  const floatVariants = shouldReduceMotion || !entranceDone
    ? {}
    : {
        y: [0, -5, 0],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      };

  // Ambient glow entrance animation
  const glowVariants = {
    initial: { scale: 0.3, opacity: 0 },
    animate: {
      scale: 1.25,
      opacity: 0.22,
      transition: {
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1] // Elegant easeOut
      }
    }
  };

  // Continuous pulsing for the glow (only active when entranceDone is true)
  const glowPulseVariants = shouldReduceMotion || !entranceDone
    ? {}
    : {
        scale: [1.25, 1.35, 1.25],
        opacity: [0.22, 0.28, 0.22],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#09090B] text-white overflow-hidden select-none">
      
      {/* ── BACKGROUND MESH ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[30%] w-[160%] h-[160%] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/25 via-[#09090B] to-[#09090B] opacity-70" />
      </div>

      {/* ── BIG BANG GLOW BACKDROP ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <motion.div
          variants={glowVariants}
          initial="initial"
          animate="animate"
          className="relative w-80 h-80"
        >
          <motion.div
            variants={glowPulseVariants}
            animate="animate"
            className="w-full h-full bg-gradient-to-br from-[#0A84FF] via-indigo-500 to-blue-700 rounded-full blur-[84px]"
          />
        </motion.div>
      </div>

      {/* ── HERO LOGO ── */}
      <div className="flex flex-col items-center justify-center z-10">
        <motion.div
          variants={logoContainerVariants}
          initial="initial"
          animate="animate"
          onAnimationComplete={() => setEntranceDone(true)}
          className="relative"
        >
          {/* Dashboard halo orbits */}
          {!shouldReduceMotion && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 rounded-full border border-white/[0.04] border-dashed"
            />
          )}

          {/* Frosted Glass Container */}
          <div className="w-40 h-40 rounded-[32px] bg-white/[0.03] border border-white/[0.1] shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center justify-center p-7">
            <motion.div animate={floatVariants} className="w-full h-full flex items-center justify-center">
              <VeyloPrepLogo className="w-full h-full object-contain" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
