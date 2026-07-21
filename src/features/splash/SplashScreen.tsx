import React from "react";
import { motion } from "motion/react";
import { VeyloPrepLogo } from "../../shared/components/logo/VeyloPrepLogo";

interface SplashScreenProps {
  isDark: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isDark }) => {
  const titleText = "VeyloPrep";

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black text-white overflow-hidden select-none">
      {/* Background Cyberpunk Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blue Glow Top Right */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 15, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-10 -right-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl"
        />
        {/* Purple Glow Bottom Left */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -10, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-10 -left-10 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl"
        />
        {/* Tech Grid Backdrop */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px]" />
      </div>

      {/* Main Content Area (Logo & Title) */}
      <div className="flex flex-col items-center justify-center z-10">
        {/* Premium Rotating/Pulsing Logo Container */}
        <div className="relative mb-6">
          {/* Animated Outer Orbit Circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 rounded-full border border-dashed border-blue-500/30"
          />
          {/* Animated Outer Pulse Ring */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 blur-md"
          />
          {/* Logo Frame */}
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 14 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-indigo-600 p-0.5 flex items-center justify-center shadow-2xl shadow-blue-500/20"
          >
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center text-white">
              <motion.div
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <VeyloPrepLogo className="w-9 h-9 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Staggered Title Reveal */}
        <div className="flex space-x-1 overflow-hidden">
          {titleText.split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: i * 0.05 + 0.1,
                type: "spring",
                stiffness: 150,
                damping: 12,
              }}
              className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-100 to-zinc-300"
            >
              {letter}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
};
