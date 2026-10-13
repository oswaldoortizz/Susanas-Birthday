import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Sparkles, Flame, X, Move } from 'lucide-react';
import { CompanionMood, GameStep } from '../types';

interface FloatingMascotsProps {
  currentStep: GameStep;
  ariText: string;
  riversText: string;
  mood: CompanionMood;
}

export const FloatingMascots: React.FC<FloatingMascotsProps> = ({
  currentStep,
  ariText,
  riversText,
  mood,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [showAriBubble, setShowAriBubble] = useState(true);
  const [showRiversBubble, setShowRiversBubble] = useState(true);

  // Auto-show bubbles on text/level/mood change, then auto-hide after 6.5s
  useEffect(() => {
    setShowAriBubble(true);
    setShowRiversBubble(true);

    const timer = setTimeout(() => {
      setShowAriBubble(false);
      setShowRiversBubble(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, [ariText, riversText, currentStep, mood]);

  // Framer motion variants for Ari's idle / victory / error inside her container
  const ariAvatarMotion: Variants = {
    idle: {
      y: [0, -6, 0],
      transition: {
        duration: 2.8,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    victory: {
      y: [0, -18, 0],
      scale: [1, 1.25, 1],
      rotate: [-5, 5, 0],
      transition: {
        duration: 0.6,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    error: {
      x: [-4, 4, -4, 4, 0],
      rotate: [-3, 3, 0],
      transition: {
        duration: 0.45,
        ease: 'easeInOut' as const,
      },
    },
  };

  // Framer motion variants for Rivers
  const riversAvatarMotion: Variants = {
    idle: {
      y: [0, -6, 0],
      transition: {
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        delay: 0.35,
      },
    },
    victory: {
      y: [0, -18, 0],
      scale: [1, 1.25, 1],
      rotate: [5, -5, 0],
      transition: {
        duration: 0.6,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    error: {
      x: [-4, 4, -4, 4, 0],
      rotate: [3, -3, 0],
      transition: {
        duration: 0.45,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div
      ref={constraintsRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      {/* ================= ARI DRAGGABLE FLOATING MASCOT ================= */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragMomentum={false}
        className="pointer-events-auto absolute bottom-3 left-3 sm:bottom-6 sm:left-6 flex flex-col items-start max-w-[210px] sm:max-w-[240px] cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* Ari Comic Speech Bubble (Moves with Ari) */}
        <AnimatePresence>
          {showAriBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={{ duration: 0.22 }}
              className="relative mb-2 p-2.5 rounded-2xl bg-[#161820]/95 border border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.3)] backdrop-blur-md text-left"
            >
              {/* Close mini button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAriBubble(false);
                }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-pink-900/80 text-pink-200 border border-pink-400 flex items-center justify-center text-[9px] hover:bg-pink-700"
                title="Cerrar mensaje"
              >
                <X className="w-2.5 h-2.5" />
              </button>

              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] font-black text-pink-300">AriGameplays</span>
                <Heart className="w-2.5 h-2.5 fill-pink-400 text-pink-400" />
              </div>
              <p className="text-[11px] leading-tight font-medium text-gray-100">
                "{ariText}"
              </p>

              {/* Speech bubble tail pointing down-left to avatar */}
              <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-[#161820] border-r border-b border-pink-500/40 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ari Floating Chibi Sticker */}
        <motion.div
          variants={ariAvatarMotion}
          animate={mood}
          onTap={() => setShowAriBubble((prev) => !prev)}
          className="relative group tap-btn"
          title="¡Toca para hablar o arrastra para moverme a donde quieras!"
        >
          {/* Victory floating hearts */}
          {mood === 'victory' && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1 animate-bounce">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </div>
          )}

          {/* Glowing Aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-pink-600 via-rose-500 to-purple-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />

          {/* Chibi Image Container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-pink-400 bg-neutral-900 shadow-[0_0_20px_rgba(244,114,182,0.6)] group-hover:border-pink-300 transition-colors">
            <img
              src="./assets/ari.png"
              alt="AriGameplays Chibi"
              draggable={false}
              className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-200 pointer-events-none select-none"
            />
          </div>

          {/* Drag Handle / Name Tag */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-pink-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md border border-white/20 whitespace-nowrap">
            <Move className="w-2.5 h-2.5 opacity-80" />
            <span>ARI 🌸</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ================= RIVERS DRAGGABLE FLOATING MASCOT ================= */}
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.12}
        dragMomentum={false}
        className="pointer-events-auto absolute bottom-3 right-3 sm:bottom-6 sm:right-6 flex flex-col items-end max-w-[210px] sm:max-w-[240px] cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* Rivers Comic Speech Bubble (Moves with Rivers) */}
        <AnimatePresence>
          {showRiversBubble && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 8 }}
              transition={{ duration: 0.22 }}
              className="relative mb-2 p-2.5 rounded-2xl bg-[#161820]/95 border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)] backdrop-blur-md text-right"
            >
              {/* Close mini button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRiversBubble(false);
                }}
                className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-rose-900/80 text-rose-200 border border-rose-400 flex items-center justify-center text-[9px] hover:bg-rose-700"
                title="Cerrar mensaje"
              >
                <X className="w-2.5 h-2.5" />
              </button>

              <div className="flex items-center justify-end gap-1 mb-0.5">
                <Flame className="w-2.5 h-2.5 text-amber-400" />
                <span className="text-[10px] font-black text-rose-300">Rivers Samantha</span>
              </div>
              <p className="text-[11px] leading-tight font-medium text-gray-100">
                "{riversText}"
              </p>

              {/* Speech bubble tail pointing down-right to avatar */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#161820] border-r border-b border-rose-500/40 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rivers Floating Chibi Sticker */}
        <motion.div
          variants={riversAvatarMotion}
          animate={mood}
          onTap={() => setShowRiversBubble((prev) => !prev)}
          className="relative group tap-btn"
          title="¡Toca para hablar o arrastra para moverme a donde quieras!"
        >
          {/* Victory floating gloves/fire */}
          {mood === 'victory' && (
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 pointer-events-none flex gap-1 animate-bounce">
              <span className="text-sm">🥊</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
          )}

          {/* Glowing Aura */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-red-500 opacity-75 blur-md group-hover:opacity-100 transition-opacity" />

          {/* Chibi Image Container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-rose-400 bg-neutral-900 shadow-[0_0_20px_rgba(244,63,94,0.6)] group-hover:border-rose-300 transition-colors">
            <img
              src="./assets/rivers.png"
              alt="Rivers Samantha Chibi"
              draggable={false}
              className="w-full h-full object-cover object-top scale-105 group-hover:scale-110 transition-transform duration-200 pointer-events-none select-none"
            />
          </div>

          {/* Drag Handle / Name Tag */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md border border-white/20 whitespace-nowrap">
            <Move className="w-2.5 h-2.5 opacity-80" />
            <span>RIVERS 🥊</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
