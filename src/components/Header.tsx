import React from 'react';
import { Volume2, VolumeX, Sparkles, Check, Lock } from 'lucide-react';
import { GameStep } from '../types';

interface HeaderProps {
  currentStep: GameStep;
  completedSteps: number[];
  isMuted: boolean;
  onToggleMute: () => void;
  onSelectStep: (step: GameStep) => void;
  onRestartIntro?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  completedSteps,
  isMuted,
  onToggleMute,
  onSelectStep,
  onRestartIntro,
}) => {
  const steps = [
    { num: 1, label: 'Viola', icon: '🎻' },
    { num: 2, label: 'Billie', icon: '🟢' },
    { num: 3, label: 'Lágrimas', icon: '👑' },
    { num: 4, label: 'AriRivers', icon: '💖' },
    { num: 5, label: 'Regalo', icon: '🎁' },
  ];

  return (
    <header className="w-full flex flex-col items-center gap-3 pt-2 pb-4">
      {/* Top Bar with Birthday Pill */}
      <div className="w-full flex items-center justify-center pr-12 sm:pr-0">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-sky-950/60 via-purple-950/70 to-pink-950/70 border border-pink-400/30 shadow-neonPink">
          <span className="text-[11px] sm:text-xs font-bold tracking-wider text-pink-200 uppercase flex items-center gap-1">
            🎂 ¡FELIZ CUMPLEAÑOS, SUSANA! 🎂
          </span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>The Birthday Quest</span>
          <Sparkles className="w-5 h-5 text-pink-300 animate-pulse" />
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 font-medium">
          <span>Tu Gran Desafío de Cumple</span>
          <span className="text-pink-400">•</span>
          <span className="text-gray-300 font-semibold">13 de Octubre</span>
          {onRestartIntro && (
            <>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <button
                onClick={onRestartIntro}
                className="text-[11px] text-pink-300 hover:text-white underline decoration-pink-500/50 hover:decoration-pink-400 transition-colors tap-btn ml-1 sm:ml-0"
                title="Volver a la mini quest para ver si eres la cumpleañera"
              >
                ¿Eres la cumpleañera?
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stepper with 5 Nodes */}
      <div className="w-full mt-2 px-1">
        <div className="relative flex items-center justify-between">
          {/* Connector Background Line */}
          <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-white/10 rounded-full -z-0">
            {/* Active Progress Fill */}
            <div
              className="h-full bg-gradient-to-r from-sky-400 via-billieLime via-purple-400 to-rose-400 rounded-full transition-all duration-500 shadow-[0_0_14px_rgba(244,114,182,0.4)]"
              style={{
                width: `${Math.max(0, ((currentStep - 1) / 4) * 100)}%`,
              }}
            />
          </div>

          {/* Step Badges */}
          {steps.map((s) => {
            const isCompleted = completedSteps.includes(s.num);
            const isCurrent = currentStep === s.num;
            const isAccessible = isCurrent || isCompleted || s.num <= currentStep;
            const isLocked = !isAccessible;

            // Thematic color for each step when active
            const activeColorClass =
              s.num === 1
                ? 'bg-sky-400 text-black ring-4 ring-sky-400/30 shadow-neonBlue scale-110'
                : s.num === 2
                ? 'bg-billieLime text-black ring-4 ring-billieLime/30 shadow-neon scale-110'
                : s.num === 3
                ? 'bg-purple-400 text-black ring-4 ring-purple-400/30 shadow-neonPurple scale-110'
                : s.num === 4
                ? 'bg-gradient-to-r from-rose-500 to-amber-400 text-white ring-4 ring-pink-400/30 shadow-neonPink scale-110'
                : 'bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 text-black ring-4 ring-amber-300/30 shadow-neon scale-110';

            const activeLabelColor =
              s.num === 1
                ? 'text-sky-300 font-bold'
                : s.num === 2
                ? 'text-billieLime font-bold'
                : s.num === 3
                ? 'text-purple-300 font-bold'
                : s.num === 4
                ? 'text-pink-300 font-bold'
                : 'text-amber-300 font-bold';

            return (
              <button
                key={s.num}
                onClick={() => {
                  if (isAccessible) {
                    onSelectStep(s.num as GameStep);
                  }
                }}
                disabled={isLocked}
                className={`relative z-10 flex flex-col items-center group transition-all ${
                  isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCurrent
                      ? activeColorClass
                      : isCompleted
                      ? 'bg-neutral-800 text-emerald-400 border border-emerald-400/40 shadow-sm'
                      : 'bg-cardGlass text-gray-500 border border-white/10'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : isLocked && s.num === 5 ? (
                    <Lock className="w-3 h-3 text-gray-500" />
                  ) : (
                    <span className="text-[11px] sm:text-xs">{s.icon}</span>
                  )}
                </div>
                <span
                  className={`mt-1 text-[10px] font-semibold transition-colors ${
                    isCurrent
                      ? activeLabelColor
                      : isCompleted
                      ? 'text-gray-300'
                      : 'text-gray-500'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
