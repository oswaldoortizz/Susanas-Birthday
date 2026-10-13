import React, { useState } from 'react';
import {
  Play,
  Music,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Ear,
  Award,
  PartyPopper,
  Volume2,
  Smile,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';
import { CompanionMood } from '../types';

interface LevelViolaProps {
  onComplete: () => void;
  isCompleted: boolean;
  onAdvance: () => void;
  onSetCompanions: (ari: string, rivers: string, mood: CompanionMood) => void;
}

type ViolaStringKey = 'C' | 'G' | 'D' | 'A';

interface ViolaStringInfo {
  key: ViolaStringKey;
  label: string;
  gauge: string;
  color: string;
}

const STRINGS: ViolaStringInfo[] = [
  { key: 'C', label: 'Cuerda C (Do)', gauge: 'h-[5px]', color: '#38BDF8' },
  { key: 'G', label: 'Cuerda G (Sol)', gauge: 'h-[4px]', color: '#C6F135' },
  { key: 'D', label: 'Cuerda D (Re)', gauge: 'h-[3px]', color: '#A855F7' },
  { key: 'A', label: 'Cuerda A (La)', gauge: 'h-[2px]', color: '#F43F5E' },
];

const PHASE_1_TARGET: ViolaStringKey[] = ['G', 'D', 'A', 'C'];
const PHASE_2_TARGET: ViolaStringKey[] = ['D', 'A', 'G'];

// Happy Birthday Guided Melody Sequence on Viola Strings
const BIRTHDAY_JAM_SEQUENCE: { key: ViolaStringKey; syllable: string }[] = [
  { key: 'C', syllable: 'Cum-' },
  { key: 'C', syllable: 'plea-' },
  { key: 'D', syllable: 'ños' },
  { key: 'C', syllable: 'fe-' },
  { key: 'G', syllable: 'liz...' },
  { key: 'C', syllable: 'Te' },
  { key: 'C', syllable: 'de-' },
  { key: 'D', syllable: 'se-' },
  { key: 'C', syllable: 'a-' },
  { key: 'A', syllable: 'mos' },
  { key: 'G', syllable: 'a ti!' },
];

interface ViolaTriviaQ {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const VIOLA_TRIVIA: ViolaTriviaQ[] = [
  {
    id: 1,
    question: '¿Cuál es la afinación exacta de las cuatro cuerdas de la viola desde la más grave a la más aguda (por quintas justas)?',
    options: [
      {
        id: 'a',
        text: 'Do (C3) — Sol (G3) — Re (D4) — La (A4)',
        isCorrect: true,
        explanation: '¡Exacto! El alma de la viola afinada en quintas con su Do grave aterciopelado.',
      },
      {
        id: 'b',
        text: 'Sol (G3) — Re (D4) — La (A4) — Mi (E5)',
        isCorrect: false,
        explanation: '¡Esa afinación es la del violín (con cuerda Mi)!',
      },
      {
        id: 'c',
        text: 'Mi (E1) — La (A1) — Re (D2) — Sol (G2)',
        isCorrect: false,
        explanation: 'Esa es la afinación del contrabajo.',
      },
    ],
  },
  {
    id: 2,
    question: '¿Por qué la viola tiene el timbre más misterioso y mágico del cuarteto de cuerdas?',
    options: [
      {
        id: 'a',
        text: 'Por su tesitura intermedia y acústica única que abraza los graves y agudos en Clave de Do',
        isCorrect: true,
        explanation: '¡Esa calidez inigualable que solo los violistas saben hacer vibrar!',
      },
      {
        id: 'b',
        text: 'Porque las cuerdas son de alambre de cobre',
        isCorrect: false,
        explanation: 'No, su magia está en su caja de resonancia y registro único.',
      },
      {
        id: 'c',
        text: 'Porque solo puede tocar notas en volumen fuerte',
        isCorrect: false,
        explanation: 'Al contrario, la viola destaca por su sutileza y dulzura.',
      },
    ],
  },
  {
    id: 3,
    question: 'Para que las cerdas del arco froten la cuerda con suavidad y generen ese sonido sedoso, ¿qué resina natural es indispensable?',
    options: [
      {
        id: 'a',
        text: 'La colofonia (resina de pino frotada en las cerdas)',
        isCorrect: true,
        explanation: '¡Indispensable en todo estuche de viola! Sin resina no hay vibración.',
      },
      {
        id: 'b',
        text: 'Cera de abeja pura',
        isCorrect: false,
        explanation: 'La cera no crearía la fricción acústica necesaria.',
      },
      {
        id: 'c',
        text: 'Talco mineral',
        isCorrect: false,
        explanation: 'El talco haría resbalar el arco sin producir sonido.',
      },
    ],
  },
];

const VIOLA_MEMES = [
  "🎻 'La viola no es un violín grande... ¡Es el alma más sabia y elegante de toda la orquesta!'",
  "🎶 '¿Por qué los compositores aman la viola? Porque cuando la melodía necesita conmover el corazón, le dan el solo a la viola.'",
  "✨ 'Superpoder de Susana: Leer Clave de Do en 3ª línea mientras los demás pianistas y violinistas se marean intentándolo.'",
];

export const LevelViola: React.FC<LevelViolaProps> = ({
  onComplete,
  isCompleted,
  onAdvance,
  onSetCompanions,
}) => {
  // Sub-phases: 1 (Reading Alto Clef) | 2 (Ear Training) | 3 (Viola Master Trivia)
  const [subPhase, setSubPhase] = useState<1 | 2 | 3>(1);
  const [userSeq, setUserSeq] = useState<ViolaStringKey[]>([]);
  const [activeString, setActiveString] = useState<ViolaStringKey | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isPlayingEarDemo, setIsPlayingEarDemo] = useState(false);

  // Playing technique: 'legato' (arco) vs 'pizzicato' (pellizco)
  const [bowStyle, setBowStyle] = useState<'legato' | 'pizzicato'>('legato');

  // Birthday Jam mode
  const [isBirthdayJamActive, setIsBirthdayJamActive] = useState(false);
  const [birthdayJamIndex, setBirthdayJamIndex] = useState(0);

  // Show memes / trivia fun facts
  const [showMemeCard, setShowMemeCard] = useState(false);
  const [currentMemeIdx, setCurrentMemeIdx] = useState(0);

  // Trivia state for Phase 1.3
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [isTriviaFullyCompleted, setIsTriviaFullyCompleted] = useState(false);

  // Play string with selected style
  const handleStringTap = (key: ViolaStringKey) => {
    setActiveString(key);

    if (bowStyle === 'pizzicato') {
      audio.playPizzicato(key);
    } else {
      audio.playViolaString(key);
    }

    setTimeout(() => {
      setActiveString(null);
    }, 450);

    // If Birthday Jam is active, handle jam sequence
    if (isBirthdayJamActive) {
      const currentTarget = BIRTHDAY_JAM_SEQUENCE[birthdayJamIndex];
      if (key === currentTarget.key) {
        const nextIdx = birthdayJamIndex + 1;
        setBirthdayJamIndex(nextIdx);

        if (nextIdx === BIRTHDAY_JAM_SEQUENCE.length) {
          audio.playSuccess();
          audio.playApplause();
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#38BDF8', '#C6F135', '#F43F5E']
          });
          onSetCompanions(
            "¡QUÉ CONCIERTAZO SUSANA! 🎂🎻 Tocaste Feliz Cumpleaños en tu viola como una verdadera reina.",
            "¡BRAVOOO! ¡El público se pone de pie a aplaudir a la patrona! 👏🥊",
            'victory'
          );
          setTimeout(() => {
            setIsBirthdayJamActive(false);
            setBirthdayJamIndex(0);
          }, 3500);
        } else {
          onSetCompanions(
            `¡Eso! Tocaste "${currentTarget.syllable}" 🎶 ¡Sigue la melodía!`,
            "¡Bien afinado ese compás mi reina! Dale a la que brilla 🥊",
            'idle'
          );
        }
      } else {
        audio.playDissonantError();
        onSetCompanions(
          "¡Esa cuerda no iba en esa nota hermosa! Mira cuál brilla con confeti 🌸",
          "¡Aguanta el compás! Toca la cuerda sugerida mi reina 🥊",
          'error'
        );
      }
      return;
    }

    if (subPhase === 3) return; // In trivia phase strings are free-play

    const target = subPhase === 1 ? PHASE_1_TARGET : PHASE_2_TARGET;
    const nextExpected = target[userSeq.length];

    if (key === nextExpected) {
      const nextSeq = [...userSeq, key];
      setUserSeq(nextSeq);
      setHasError(false);

      if (nextSeq.length === target.length) {
        audio.playSuccess();

        if (subPhase === 1) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 }
          });
          onSetCompanions(
            "¡Lectura de Clave de Do perfecta mi Susana! 🎻 Ahora afinemos el oído musical.",
            "¡Esa viola sonó de orquesta! Dale al reto a ciegas crack 🥊",
            'victory'
          );
          setTimeout(() => {
            setSubPhase(2);
            setUserSeq([]);
          }, 1200);
        } else if (subPhase === 2) {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.7 }
          });
          onSetCompanions(
            "¡Oído absoluto confirmado! 🌸🎶 Ahora demuestra tu sabiduría de violista profesional.",
            "¡A la primera de oído! A ver si te sabes los secretos de la cuerda frotada 🔥",
            'victory'
          );
          setTimeout(() => {
            setSubPhase(3);
            setUserSeq([]);
          }, 1200);
        }
      } else {
        onSetCompanions(
          "¡Nota exacta! Continúa con la melodía...",
          "¡Bien tocado! Sigue el ritmo sin dudar.",
          'idle'
        );
      }
    } else {
      audio.playDissonantError();
      setHasError(true);
      setUserSeq([]);

      if (subPhase === 1) {
        onSetCompanions(
          "¡Casi! Recuerda la 3ª línea en Clave de Do. ¡Tú puedes hermosa! 💕",
          "¡Aguanta el arco! Lee el compás con calma y vuelve a empezar 🥊",
          'error'
        );
      } else {
        onSetCompanions(
          "¡Esa nota se escapó! Vuelve a escuchar la secuencia auditiva 🎧",
          "¡No te me apagues Susana! Escucha el timbre y dale de nuevo.",
          'error'
        );
      }

      setTimeout(() => setHasError(false), 700);
    }
  };

  // Play ear training audio demo
  const handlePlayEarDemo = () => {
    if (isPlayingEarDemo) return;
    setIsPlayingEarDemo(true);
    setUserSeq([]);

    onSetCompanions(
      "Escucha con atención las 3 notas que resuenan en la sala...",
      "¡Párense de pestañas! Agudiza el oído y replícalo en las cuerdas 🔥",
      'idle'
    );

    PHASE_2_TARGET.forEach((note, idx) => {
      setTimeout(() => {
        audio.playViolaString(note, 0.7);
        if (idx === PHASE_2_TARGET.length - 1) {
          setTimeout(() => {
            setIsPlayingEarDemo(false);
          }, 800);
        }
      }, idx * 750);
    });
  };

  // Trivia option selection
  const handleTriviaSelect = (optId: string) => {
    const q = VIOLA_TRIVIA[triviaIdx];
    const opt = q.options.find(o => o.id === optId);
    setSelectedOpt(optId);

    if (opt?.isCorrect) {
      audio.playSuccess();
      setTriviaFeedback({ isSuccess: true, text: opt.explanation });
      onSetCompanions(
        "¡Excelente respuesta! Tienes la música en las venas Susana 💖",
        "¡Uff qué cátedra de viola! Sabiduría musical de diez 🥊",
        'victory'
      );

      setTimeout(() => {
        if (triviaIdx < VIOLA_TRIVIA.length - 1) {
          setTriviaIdx(prev => prev + 1);
          setSelectedOpt(null);
          setTriviaFeedback(null);
        } else {
          setIsTriviaFullyCompleted(true);
          onComplete();
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 }
          });
          onSetCompanions(
            "¡TÍTULO DE MAESTRA DE VIOLA DESBLOQUEADO! 🎻✨ Eres un orgullo enorme.",
            "¡Rompió todos los récords de la orquesta! ¡Avanza a Billie Eilish!",
            'victory'
          );
        }
      }, 1400);
    } else {
      audio.playDissonantError();
      setTriviaFeedback({ isSuccess: false, text: opt?.explanation || '¡Intenta con otra opción!' });
      onSetCompanions(
        "¡Esa es de otro instrumento hermosa! Piensa en tu viola 🌸",
        "¡No me desafines el concepto mi reina! Prueba otra vez 🥊",
        'error'
      );
    }
  };

  const handleApplauseTrigger = () => {
    audio.playApplause();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#38BDF8', '#C6F135']
    });
    onSetCompanions(
      "¡Qué ovación tan merecida! El público enloquece con tu talento 💖👏",
      "¡BRAVÍSIMO! ¡Una noche inolvidable en el Palacio de Bellas Artes!",
      'victory'
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-stringC uppercase tracking-wider flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5" /> Nivel 1 • Academia de Viola
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stringC/10 text-stringC border border-stringC/20">
            {subPhase === 1 ? 'Fase 1.1: Lectura' : subPhase === 2 ? 'Fase 1.2: Oído' : 'Fase 1.3: Cultura'}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white">
          El Enigma de la Viola 🎻
        </h2>
        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
          {subPhase === 1
            ? 'Fase 1.1: Lee la partitura limpia en Clave de Do (Alto Clef) y toca las cuerdas exactas.'
            : subPhase === 2
            ? 'Fase 1.2: Oído Absoluto. Escucha la frase sonora y reprodúcela en las cuerdas sin partitura.'
            : 'Fase 1.3: El Reto de la Cuerda Frotada. Preguntas exclusivas para violistas apasionadas.'}
        </p>

        {/* Fun Viola Tools Bar */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setBowStyle('legato')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all tap-btn ${
                bowStyle === 'legato'
                  ? 'bg-stringC text-black shadow-neon'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              🎻 Arco Legato
            </button>
            <button
              onClick={() => setBowStyle('pizzicato')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all tap-btn ${
                bowStyle === 'pizzicato'
                  ? 'bg-purple-500 text-white shadow-neon'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              🤏 Pizzicato
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleApplauseTrigger}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all tap-btn flex items-center gap-1"
              title="Ovación del público en concierto"
            >
              <span>👏 Ovación</span>
            </button>
            <button
              onClick={() => {
                setShowMemeCard(!showMemeCard);
                setCurrentMemeIdx((prev) => (prev + 1) % VIOLA_MEMES.length);
              }}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 transition-all tap-btn flex items-center gap-1"
            >
              <Smile className="w-3 h-3" />
              <span>Dato Curioso</span>
            </button>
          </div>
        </div>

        {/* Fun Viola Quote Modal/Box */}
        {showMemeCard && (
          <div className="mt-2.5 p-2.5 rounded-xl bg-purple-950/40 border border-purple-400/30 text-purple-200 text-xs italic leading-relaxed animate-fadeIn">
            {VIOLA_MEMES[currentMemeIdx]}
          </div>
        )}
      </div>

      {/* PHASE 1.1: Clean Alto Clef Staff */}
      {subPhase === 1 && (
        <div className="glass-panel rounded-2xl p-3 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
              <span>𝄡</span>
              <span>Partitura en Clave de Do (Alto Clef)</span>
            </span>
            <span className="text-[11px] text-gray-400 font-mono">Compás 4/4</span>
          </div>

          <div className="w-full bg-[#101217] rounded-xl p-3 border border-white/5 relative overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 340 105" className="w-full max-w-[340px] h-auto select-none">
              {[25, 40, 55, 70, 85].map((y, idx) => (
                <line
                  key={idx}
                  x1="45"
                  y1={y}
                  x2="330"
                  y2={y}
                  stroke={y === 55 ? '#94A3B8' : '#4B5563'}
                  strokeWidth={y === 55 ? '1.8' : '1.2'}
                />
              ))}
              <line x1="105" y1="25" x2="105" y2="85" stroke="#374151" strokeWidth="1" />
              <line x1="175" y1="25" x2="175" y2="85" stroke="#374151" strokeWidth="1" />
              <line x1="245" y1="25" x2="245" y2="85" stroke="#374151" strokeWidth="1" />
              <line x1="324" y1="25" x2="324" y2="85" stroke="#9CA3AF" strokeWidth="1.2" />
              <line x1="328" y1="25" x2="328" y2="85" stroke="#9CA3AF" strokeWidth="2.5" />

              {/* Alto Clef */}
              <g transform="translate(12, 20)">
                <line x1="8" y1="5" x2="8" y2="65" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="12" y1="5" x2="12" y2="65" stroke="#FFFFFF" strokeWidth="1.5" />
                <path d="M 12 10 C 24 10, 28 20, 22 30 C 18 35, 12 35, 12 35" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M 12 35 C 18 35, 28 40, 22 55 C 16 65, 12 60, 12 60" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
                <polygon points="12,35 17,32 17,38" fill="#FFFFFF" />
              </g>

              {/* Note 1: G3 */}
              <g transform="translate(75, 78)">
                <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#E2E8F0" />
                <line x1="6" y1="0" x2="6" y2="-28" stroke="#E2E8F0" strokeWidth="1.5" />
              </g>
              {/* Note 2: D4 */}
              <g transform="translate(140, 40)">
                <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#E2E8F0" />
                <line x1="-6" y1="0" x2="-6" y2="28" stroke="#E2E8F0" strokeWidth="1.5" />
              </g>
              {/* Note 3: A4 */}
              <g transform="translate(210, 17)">
                <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#E2E8F0" />
                <line x1="-6" y1="0" x2="-6" y2="28" stroke="#E2E8F0" strokeWidth="1.5" />
              </g>
              {/* Note 4: C3 */}
              <g transform="translate(285, 95)">
                <line x1="-12" y1="0" x2="12" y2="0" stroke="#94A3B8" strokeWidth="1.5" />
                <line x1="-12" y1="-10" x2="12" y2="-10" stroke="#64748B" strokeWidth="1" />
                <ellipse cx="0" cy="0" rx="6" ry="4.5" fill="#E2E8F0" />
                <line x1="6" y1="0" x2="6" y2="-28" stroke="#E2E8F0" strokeWidth="1.5" />
              </g>
            </svg>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  userSeq.length > idx ? 'bg-billieLime scale-125 shadow-neon' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* PHASE 1.2: Ear Training */}
      {subPhase === 2 && (
        <div className="glass-panel rounded-2xl p-4 border border-billieLime/30 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-billieLime/10 border border-billieLime/30 flex items-center justify-center text-billieLime shadow-neon">
            <Ear className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Desafío de Oído Absoluto</h3>
            <p className="text-xs text-gray-300 mt-1 max-w-xs mx-auto">
              Escucha la melodía y toca las mismas cuerdas de memoria sin guía visual.
            </p>
          </div>
          <button
            onClick={handlePlayEarDemo}
            disabled={isPlayingEarDemo}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-billieLime text-black font-extrabold text-xs tracking-wider shadow-neon hover:bg-[#b5dc2f] transition-all tap-btn"
          >
            <Play className={`w-3.5 h-3.5 fill-black ${isPlayingEarDemo ? 'animate-spin' : ''}`} />
            <span>{isPlayingEarDemo ? 'REPRODUCIENDO MELODÍA...' : 'ESCUCHAR SECUENCIA AUDITIVA 🎧'}</span>
          </button>
          <div className="flex items-center justify-center gap-2 mt-1">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  userSeq.length > idx ? 'bg-billieLime scale-125 shadow-neon' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* PHASE 1.3: Viola Master Trivia */}
      {subPhase === 3 && (
        <div className="glass-panel-neon rounded-2xl p-4 border border-stringC/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-stringC/20 text-stringC border border-stringC/30">
              Pregunta {triviaIdx + 1} de 3
            </span>
            <span className="text-xs text-stringC font-semibold flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Cultura de Cuerdas</span>
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white mb-3 leading-relaxed">
            {VIOLA_TRIVIA[triviaIdx].question}
          </h3>

          {triviaFeedback && (
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 mb-3 ${
                triviaFeedback.isSuccess
                  ? 'bg-billieLime/15 text-billieLime border border-billieLime/30'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
              }`}
            >
              {triviaFeedback.isSuccess ? '✓ ' : '✕ '} {triviaFeedback.text}
            </div>
          )}

          <div className="space-y-2">
            {VIOLA_TRIVIA[triviaIdx].options.map((opt) => {
              const isChosen = selectedOpt === opt.id;
              const isCorrectFeedback = isChosen && triviaFeedback?.isSuccess;
              const isWrongFeedback = isChosen && triviaFeedback && !triviaFeedback.isSuccess;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleTriviaSelect(opt.id)}
                  disabled={isTriviaFullyCompleted || (triviaFeedback?.isSuccess ?? false)}
                  className={`w-full p-3 rounded-xl text-left text-xs sm:text-sm font-medium flex items-start justify-between border transition-all tap-btn ${
                    isCorrectFeedback
                      ? 'bg-gradient-to-r from-stringC to-emerald-600 text-black font-bold border-white shadow-neon'
                      : isWrongFeedback
                      ? 'bg-rose-900/40 text-rose-200 border-rose-500/40'
                      : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-stringC/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center text-[10px] font-mono text-stringC uppercase shrink-0 mt-0.5">
                      {opt.id}
                    </span>
                    <span className="leading-snug">{opt.text}</span>
                  </div>
                  {isCorrectFeedback && <CheckCircle2 className="w-4 h-4 text-black shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Birthday Jam Interactive Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/60 via-amber-950/40 to-neutral-900 border border-amber-500/30 flex items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2">
          <PartyPopper className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
          <div>
            <span className="text-xs font-bold text-white block">
              Minijuego: ¡Toca Feliz Cumpleaños! 🎂
            </span>
            <span className="text-[10px] text-gray-300">
              {isBirthdayJamActive
                ? `Toca la cuerda de la sílaba: "${BIRTHDAY_JAM_SEQUENCE[birthdayJamIndex]?.syllable}" (${birthdayJamIndex + 1}/${BIRTHDAY_JAM_SEQUENCE.length})`
                : 'Toca las cuerdas guiadas por la melodía de tu cumple'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setIsBirthdayJamActive(!isBirthdayJamActive);
            setBirthdayJamIndex(0);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all tap-btn shrink-0 ${
            isBirthdayJamActive
              ? 'bg-amber-400 text-black shadow-neon'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
          }`}
        >
          {isBirthdayJamActive ? 'Pausar Jam' : '¡Activar! 🎵'}
        </button>
      </div>

      {/* Fretboard with 4 Interactive Strings (C, G, D, A) */}
      <div
        className={`glass-panel-neon rounded-2xl p-4 border transition-colors ${
          hasError ? 'border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.4)]' : 'border-billieLime/30'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Diapasón de la Viola
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-stringC">
              {bowStyle === 'pizzicato' ? 'Pizzicato 🤏' : 'Legato 🎻'}
            </span>
          </div>
          {userSeq.length > 0 && subPhase !== 3 && !isBirthdayJamActive && (
            <button
              onClick={() => {
                setUserSeq([]);
                setHasError(false);
              }}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 tap-btn"
            >
              <RotateCcw className="w-3 h-3" /> Reiniciar compás
            </button>
          )}
        </div>

        <div className="w-full bg-gradient-to-r from-[#181920] via-[#1f212a] to-[#181920] rounded-xl p-3 border border-white/10 flex flex-col gap-3 shadow-inner relative overflow-hidden">
          {STRINGS.map((str) => {
            const isTapped = activeString === str.key;
            const isJamTarget = isBirthdayJamActive && BIRTHDAY_JAM_SEQUENCE[birthdayJamIndex]?.key === str.key;

            return (
              <div
                key={str.key}
                onClick={() => handleStringTap(str.key)}
                className={`relative w-full py-2.5 px-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-150 select-none tap-btn ${
                  hasError
                    ? 'bg-rose-950/40 border border-rose-500/50'
                    : isJamTarget
                    ? 'bg-amber-500/25 border border-amber-400 ring-2 ring-amber-400/50 shadow-neon'
                    : isTapped
                    ? 'bg-white/15 scale-[1.01]'
                    : 'bg-black/30 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 z-10">
                  <span className={`text-xs font-bold tracking-wide ${isJamTarget ? 'text-amber-300 font-extrabold' : 'text-white'}`}>
                    {str.label}
                  </span>
                  {isJamTarget && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-black animate-pulse">
                      ¡Toca aquí!
                    </span>
                  )}
                </div>

                <div className="absolute left-28 right-16 top-1/2 -translate-y-1/2 z-0">
                  <div
                    className={`w-full ${str.gauge} rounded-full transition-all ${
                      hasError ? 'bg-rose-500 shadow-[0_0_10px_#f43f5e]' : isJamTarget ? 'bg-amber-300 shadow-[0_0_15px_#f59e0b]' : isTapped ? 'vibrating shadow-lg' : ''
                    }`}
                    style={{
                      backgroundColor: hasError ? '#F43F5E' : isJamTarget ? '#F59E0B' : str.color,
                      boxShadow: isTapped ? `0 0 14px ${str.color}` : 'none',
                    }}
                  />
                </div>

                <div className="z-10">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                      isJamTarget
                        ? 'bg-amber-400 text-black border-amber-300'
                        : isTapped
                        ? 'bg-white text-black border-white'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    Tocar
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Advance Button: ONLY appears when Phase 1.3 is completed in this session! */}
        {isTriviaFullyCompleted && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2 animate-fadeIn">
            <div className="flex items-center justify-center gap-2 text-billieLime text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Nivel de Viola Completado con Honores!</span>
            </div>
            <button
              onClick={onAdvance}
              className="w-full py-3.5 px-4 rounded-xl bg-billieLime hover:bg-[#b0d82d] text-black font-extrabold text-sm tracking-wide transition-all shadow-neonStrong tap-btn flex items-center justify-center gap-2"
            >
              <span>PASAR AL NIVEL 2: BILLIE EILISH ➜</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
