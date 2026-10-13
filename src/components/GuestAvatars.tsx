import React, { useState } from 'react';
import { GameStep } from '../types';
import { Sparkles, Heart } from 'lucide-react';

interface GuestAvatarsProps {
  currentStep: GameStep;
  customMessage?: {
    ari?: string;
    rivers?: string;
  } | null;
}

export const GuestAvatars: React.FC<GuestAvatarsProps> = ({
  currentStep,
  customMessage,
}) => {
  const [clickReaction, setClickReaction] = useState<string | null>(null);

  // Default dialogues per level
  const defaultDialogues: Record<GameStep, { ari: string; rivers: string }> = {
    1: {
      ari: "¡Feliz cumple Susana hermosa! 🌸 Toca con tu viola la secuencia mágica en Clave de Do para iniciar el festejo.",
      rivers: "¡Esaaa, felicidades crack! 🥊 Dale con todo a ese arco. ¡Haz sonar esas 4 cuerdas y revienta el nivel!",
    },
    2: {
      ari: "¡Amo a Billie Eilish, su estética te queda tan bien! 💚 Adivina las melodías acústicas y sus letras.",
      rivers: "¡Uff, Birds of a Feather acústica! 🎧 Con esta rola nos ponemos sentimentales. ¡Ponte modo detective musical!",
    },
    3: {
      ari: "¡Llegó la trivia de nosotras dos! 💕 A ver si te sabes los momentos más icónicos de nuestra amistad y shippeo.",
      rivers: "¡No manches Susana, ponte trucha! 🔥 En La Velada lo dimos todo y aquí tienes que demostrar que te sabes el lore.",
    },
    4: {
      ari: "¡Llegaste a nuestro lore Susana! 💕 A ver si te sabes los momentos virales de nuestra amistad.",
      rivers: "¡Aquí no hay spoilers mi reina! ¡Demuéstranos qué tan fan eres! 🥊",
    },
    5: {
      ari: "¡LO LOGRASTE SUSANA! 🎂💖 Eres sumamente talentosa y especial. ¡Abre tu regalo que te mereces el mundo entero!",
      rivers: "¡Eso patrona! 👑🥊 ¡Desbloqueaste el regalo final! Prepárate para el confeti y las fotos con tus gatitos hermosos.",
    },
  };

  const currentAriText = customMessage?.ari || defaultDialogues[currentStep].ari;
  const currentRiversText = customMessage?.rivers || defaultDialogues[currentStep].rivers;

  const handleAriClick = () => {
    const ariPhrases = [
      "¡Te mandamos el abrazo más gigante, Susana! 🌸✨",
      "¡Qué hermosa foto con tu viola tienes en el concierto! 🎻💖",
      "¡Tus gatitos son las cosas más tiernas del universo! 🐾",
      "¡Rivers y yo estamos súper orgullosas de ti hoy! 🥰",
    ];
    setClickReaction(ariPhrases[Math.floor(Math.random() * ariPhrases.length)]);
    setTimeout(() => setClickReaction(null), 3500);
  };

  const handleRiversClick = () => {
    const riversPhrases = [
      "¡Felicidades mi reina! ¡Hoy se festeja con todo! 🥊🔥",
      "¡Susana la mera mera de la viola, qué pro! 🎻⚡",
      "¡Díganle a los michis que saluden a la cumpleañera! 🐱👑",
      "¡Te la rifaste un montón, eres una leyenda! 💯",
    ];
    setClickReaction(riversPhrases[Math.floor(Math.random() * riversPhrases.length)]);
    setTimeout(() => setClickReaction(null), 3500);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-3.5 border border-white/10 shadow-cardGlass relative overflow-hidden my-2">
      {/* Glow aura */}
      <div className="absolute -top-12 -left-12 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header bar: Special guests */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-white/5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-billieLime" />
          <span>Compañeras de Misión:</span>
          <span className="text-purple-400 font-semibold">Ari</span>
          <span className="text-gray-500">&</span>
          <span className="text-rose-400 font-semibold">Rivers</span>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-billieLime border border-billieLime/20">
          En Vivo 🔴
        </span>
      </div>

      {/* Interactive reaction popup when tapping an avatar */}
      {clickReaction && (
        <div className="mb-2.5 p-2 rounded-xl bg-gradient-to-r from-purple-900/90 to-rose-900/90 border border-billieLime/40 text-center text-xs font-bold text-white shadow-neon animate-bounce">
          {clickReaction}
        </div>
      )}

      {/* Dialogues grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Ari's Bubble */}
        <div 
          onClick={handleAriClick}
          className="flex items-start gap-2.5 p-2 rounded-xl bg-purple-950/20 border border-purple-500/20 hover:border-purple-400/40 transition-all cursor-pointer group"
          title="Toca a Ari para interactuar"
        >
          {/* Ari Avatar */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden relative">
                {/* Stylized Gamer Girl with Pink Cat Ears */}
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-900/80 to-pink-950/80">
                  <span className="text-lg select-none">🐱</span>
                  <div className="absolute -top-0.5 -right-0.5">
                    <Heart className="w-3 h-3 text-pink-400 fill-pink-400" />
                  </div>
                </div>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-purple-600 text-white px-1 rounded-full">
              ARI
            </span>
          </div>

          {/* Ari Speech */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-purple-300">AriGameplays</span>
              <span className="text-[9px] text-pink-400">✨</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-200 mt-0.5">
              "{currentAriText}"
            </p>
          </div>
        </div>

        {/* Rivers' Bubble */}
        <div 
          onClick={handleRiversClick}
          className="flex items-start gap-2.5 p-2 rounded-xl bg-rose-950/20 border border-rose-500/20 hover:border-rose-400/40 transition-all cursor-pointer group"
          title="Toca a Rivers para interactuar"
        >
          {/* Rivers Avatar */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-red-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center overflow-hidden relative">
                {/* Stylized Street Gamer with Cap */}
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-rose-950/80 to-amber-950/80">
                  <span className="text-lg select-none">🧢</span>
                  <span className="absolute -top-0.5 -right-0.5 text-[9px]">🥊</span>
                </div>
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-rose-600 text-white px-1 rounded-full">
              RIV
            </span>
          </div>

          {/* Rivers Speech */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-rose-300">Rivers Samantha</span>
              <span className="text-[9px] text-amber-400">🥊</span>
            </div>
            <p className="text-[11px] leading-relaxed text-gray-200 mt-0.5">
              "{currentRiversText}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
