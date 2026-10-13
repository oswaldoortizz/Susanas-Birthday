import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Sparkles, Flame } from 'lucide-react';
import { CompanionMood, GameStep } from '../types';

interface StreamerCompanionsProps {
  currentStep: GameStep;
  ariText: string;
  riversText: string;
  mood: CompanionMood;
  onTapCompanion?: () => void;
}

export const StreamerCompanions: React.FC<StreamerCompanionsProps> = ({
  ariText,
  riversText,
  mood,
  onTapCompanion,
}) => {
  // Motion animation variants based on mood
  const avatarMotion: Variants = {
    idle: {
      y: [0, -4, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
    victory: {
      y: [0, -14, 0],
      scale: [1, 1.22, 1],
      rotate: [-3, 3, 0],
      transition: {
        duration: 0.65,
        repeat: 2,
        ease: 'easeOut' as const,
      },
    },
    error: {
      x: [-4, 4, -4, 4, 0],
      rotate: [-2, 2, -1, 1, 0],
      transition: {
        duration: 0.45,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <div
      onClick={onTapCompanion}
      className="w-full glass-panel rounded-2xl p-3 border border-white/10 shadow-cardGlass relative overflow-hidden my-2 select-none cursor-pointer transition-all hover:border-billieLime/40"
      title="Toca a Ari y Rivers para interactuar"
    >
      {/* Background ambient light */}
      <div className="absolute -top-10 -left-10 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header ticker */}
      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/5 text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-billieLime animate-pulse" />
          <span>Compañeras en Directo:</span>
          <span className="text-pink-400 font-extrabold">Ari</span>
          <span className="text-gray-500">&</span>
          <span className="text-rose-400 font-extrabold">Rivers</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] uppercase font-bold text-billieLime tracking-wider">
            {mood === 'victory' ? '¡VICTORIA! 🎉' : mood === 'error' ? '¡CASI! 💥' : 'EN VIVO 🔴'}
          </span>
        </div>
      </div>

      {/* Floating Victory Particles */}
      <AnimatePresence>
        {mood === 'victory' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, y: 30, x: 20 + i * 50 }}
                animate={{ opacity: 0, y: -40, scale: 1.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, delay: i * 0.1 }}
                className="absolute text-pink-400"
              >
                {i % 2 === 0 ? <Heart className="w-4 h-4 fill-pink-400" /> : <Sparkles className="w-4 h-4 text-yellow-300" />}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Companions layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* ARI GAMEPLAYS */}
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-purple-950/20 border border-purple-500/25 relative group">
          {/* Animated 2D Vector Avatar: Ari */}
          <motion.div
            variants={avatarMotion}
            animate={mood}
            className="shrink-0 relative w-12 h-12"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="ariHair" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C084FC" />
                  <stop offset="100%" stopColor="#7E22CE" />
                </linearGradient>
                <linearGradient id="ariSkin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FED7AA" />
                  <stop offset="100%" stopColor="#FDBA74" />
                </linearGradient>
              </defs>
              {/* Back Hair */}
              <circle cx="50" cy="52" r="34" fill="url(#ariHair)" />
              {/* Face Base */}
              <circle cx="50" cy="54" r="24" fill="url(#ariSkin)" />
              {/* Blushes */}
              <ellipse cx="38" cy="62" rx="4" ry="2.5" fill="#FB7185" opacity="0.65" />
              <ellipse cx="62" cy="62" rx="4" ry="2.5" fill="#FB7185" opacity="0.65" />
              {/* Eyes */}
              <ellipse cx="40" cy="52" rx="3.5" ry="4.5" fill="#1E1B4B" />
              <ellipse cx="60" cy="52" rx="3.5" ry="4.5" fill="#1E1B4B" />
              {/* Eye sparkles */}
              <circle cx="41" cy="50" r="1.5" fill="#FFFFFF" />
              <circle cx="61" cy="50" r="1.5" fill="#FFFFFF" />
              {/* Sweet smile */}
              <path d="M 46 62 Q 50 66 54 62" stroke="#BE185D" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Bangs */}
              <path d="M 28 44 Q 50 34 72 44 Q 50 48 28 44 Z" fill="url(#ariHair)" />
              {/* Pink Cat Headset Band */}
              <path d="M 24 46 Q 50 20 76 46" stroke="#F472B6" strokeWidth="4.5" fill="none" strokeLinecap="round" />
              {/* Left Cat Ear */}
              <polygon points="28,32 16,14 38,24" fill="#EC4899" stroke="#F472B6" strokeWidth="2" />
              <polygon points="27,28 20,18 33,23" fill="#FBCFE8" />
              {/* Right Cat Ear */}
              <polygon points="72,32 84,14 62,24" fill="#EC4899" stroke="#F472B6" strokeWidth="2" />
              <polygon points="73,28 80,18 67,23" fill="#FBCFE8" />
              {/* Headphone Earcups */}
              <rect x="20" y="44" width="7" height="15" rx="3.5" fill="#DB2777" />
              <rect x="73" y="44" width="7" height="15" rx="3.5" fill="#DB2777" />
            </svg>
            <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-pink-600 text-white px-1 rounded-full shadow">
              ARI
            </span>
          </motion.div>

          {/* Comic Dialogue Bubble: Ari */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-pink-300">AriGameplays</span>
              <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
            </div>
            <p className="text-[11px] leading-relaxed text-gray-200 mt-0.5">
              "{ariText}"
            </p>
          </div>
        </div>

        {/* RIVERS SAMANTHA */}
        <div className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-950/20 border border-rose-500/25 relative group">
          {/* Animated 2D Vector Avatar: Rivers */}
          <motion.div
            variants={avatarMotion}
            animate={mood}
            className="shrink-0 relative w-12 h-12"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="rivHair" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
                <linearGradient id="rivSkin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FED7AA" />
                  <stop offset="100%" stopColor="#FDBA74" />
                </linearGradient>
              </defs>
              {/* Hair strands behind */}
              <circle cx="50" cy="54" r="32" fill="url(#rivHair)" />
              {/* Face Base */}
              <circle cx="50" cy="54" r="23" fill="url(#rivSkin)" />
              {/* Eyes */}
              <ellipse cx="40" cy="52" rx="3.2" ry="4" fill="#0F172A" />
              <ellipse cx="60" cy="52" rx="3.2" ry="4" fill="#0F172A" />
              {/* Sparkle */}
              <circle cx="41" cy="50.5" r="1.3" fill="#FFFFFF" />
              <circle cx="61" cy="50.5" r="1.3" fill="#FFFFFF" />
              {/* Confident energetic smirk */}
              <path d="M 45 62 Q 52 66 58 60" stroke="#991B1B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              {/* Backwards Snapback Cap */}
              <path d="M 26 44 C 26 26 74 26 74 44 Z" fill="#18181B" stroke="#F43F5E" strokeWidth="1.8" />
              {/* Cap Brim turned backward */}
              <ellipse cx="50" cy="28" rx="20" ry="6" fill="#27272A" stroke="#F43F5E" strokeWidth="1.2" />
              {/* Cap logo / badge */}
              <circle cx="50" cy="38" r="3.5" fill="#EF4444" />
              {/* Oversized hoodie collar */}
              <path d="M 28 78 Q 50 68 72 78 L 76 92 L 24 92 Z" fill="#3F3F46" />
              <path d="M 42 74 L 50 84 L 58 74" stroke="#F43F5E" strokeWidth="2" fill="none" />
            </svg>
            <span className="absolute -bottom-1 -right-1 text-[8px] font-black bg-rose-600 text-white px-1 rounded-full shadow">
              RIV
            </span>
          </motion.div>

          {/* Comic Dialogue Bubble: Rivers */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-rose-300">Rivers Samantha</span>
              <Flame className="w-3 h-3 text-amber-400" />
            </div>
            <p className="text-[11px] leading-relaxed text-gray-200 mt-0.5">
              "{riversText}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
