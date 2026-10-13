import React, { useState, useEffect } from 'react';
import {
  Heart,
  CheckCircle2,
  RotateCcw,
  Bookmark,
  BookOpen,
  Quote,
  Sparkles,
  Check,
  X,
  Music2,
  Volume2,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';
import { CompanionMood } from '../types';

interface LevelQueenOfTearsProps {
  onComplete: () => void;
  isCompleted: boolean;
  onAdvance: () => void;
  onSetCompanions: (ari: string, rivers: string, mood: CompanionMood) => void;
}

// Sub-reto 3.1: Words for the Chapter 12 Quote
// "si reencarnara cien veces, me casaría contigo cada una de ellas"
const TARGET_WORDS = [
  'si',
  'reencarnara',
  'cien',
  'veces,',
  'me',
  'casaría',
  'contigo',
  'cada',
  'una',
  'de',
  'ellas',
];

// Sub-reto 3.2: Confession Match Pairs from personal notes
interface ConfessionPair {
  id: string;
  start: string;
  ending: string;
}

const CONFESSION_PAIRS: ConfessionPair[] = [
  {
    id: 'c1',
    start: '¿le gusto? ¿de verdad?',
    ending: 'pero no es mi caso. yo... la amo.',
  },
  {
    id: 'c2',
    start: 'quiero vivir, desesperadamente.',
    ending: 'lo sé, pero quería esa vida.',
  },
  {
    id: 'c3',
    start: 'te amo.',
    ending: '¿estás bien?',
  },
];

export const LevelQueenOfTears: React.FC<LevelQueenOfTearsProps> = ({
  onComplete,
  isCompleted,
  onAdvance,
  onSetCompanions,
}) => {
  // Subphase: 1 (Capítulo 12) | 2 (Confesiones Match) | 3 (El Trébol de los Recuerdos)
  const [subPhase, setSubPhase] = useState<1 | 2 | 3>(1);

  // Sub-reto 3.1 State
  const initialScramble = [
    'cien',
    'si',
    'contigo',
    'me',
    'reencarnara',
    'veces,',
    'de',
    'cada',
    'casaría',
    'ellas',
    'una',
  ];
  const [availableWords, setAvailableWords] = useState<string[]>(initialScramble);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [quoteRevealed, setQuoteRevealed] = useState(false);
  const [quoteError, setQuoteError] = useState(false);

  // Sub-reto 3.2 State
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnding, setSelectedEnding] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [matchError, setMatchError] = useState(false);

  // Shuffled endings for column
  const [shuffledEndings] = useState<string[]>([
    CONFESSION_PAIRS[1].ending, // "lo sé, pero quería esa vida."
    CONFESSION_PAIRS[0].ending, // "pero no es mi caso. yo... la amo."
    CONFESSION_PAIRS[2].ending, // "¿estás bien?"
  ]);

  // Sub-reto 3.3 State (El Trébol de los Recuerdos)
  const [selectedSpecialDetail, setSelectedSpecialDetail] = useState<string | null>(null);
  const [specialDetailSuccess, setSpecialDetailSuccess] = useState(false);
  const [isPlayingOST, setIsPlayingOST] = useState(false);

  // Set initial mascot reactions on mount
  useEffect(() => {
    onSetCompanions(
      "¡Nooo, ya voy a llorar! 😭 Esa frase del capítulo 12 me destruye...",
      "¡Qué joya de serie, Susana! 🥺 Te las sabes toditas.",
      'idle'
    );
  }, []);

  const handlePlayOST = () => {
    setIsPlayingOST(true);
    audio.playQueenOfTearsTheme();
    onSetCompanions(
      "Esa melodía... Es como revivir cada mirada de Hyun-woo y Hae-in 🌸🥺",
      "¡Qué banda sonora tan emotiva! Súbele al volumen crack.",
      'idle'
    );
    setTimeout(() => setIsPlayingOST(false), 9000);
  };

  // Sub-reto 3.1: Tap word from bank to append to quote
  const handleSelectWord = (word: string, indexInAvailable: number) => {
    if (quoteRevealed) return;

    const nextExpected = TARGET_WORDS[selectedWords.length];

    if (word === nextExpected) {
      const nextSelected = [...selectedWords, word];
      setSelectedWords(nextSelected);

      const nextAvail = [...availableWords];
      nextAvail.splice(indexInAvailable, 1);
      setAvailableWords(nextAvail);

      audio.playTone(460 + nextSelected.length * 36, 0.22, 'sine', 0.22);

      if (nextSelected.length === TARGET_WORDS.length) {
        audio.playSuccess();
        setQuoteRevealed(true);
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C084FC', '#F472B6', '#E879F9']
        });
        onSetCompanions(
          "¡Nooo, ya voy a llorar! 😭 Esa frase del capítulo 12 me destruye...",
          "¡Qué joya de serie, Susana! 🥺 Te las sabes toditas.",
          'victory'
        );
      } else {
        onSetCompanions(
          "Qué hermosa frase... Sigue ordenando las palabras 🌸",
          "¡Esa misma palabra! Sigue con la que viene 🥊",
          'idle'
        );
      }
    } else {
      audio.playDissonantError();
      setQuoteError(true);
      onSetCompanions(
        "Esa palabra va en otra parte hermosa... Recuerda la escena en tu corazón 💕",
        "¡Aguanta el drama! Esa no sigue ahí, dale otra vez mi reina 🥊",
        'error'
      );
      setTimeout(() => setQuoteError(false), 600);
    }
  };

  // Undo last selected word
  const handleRemoveLastWord = () => {
    if (selectedWords.length === 0 || quoteRevealed) return;
    const wordToReturn = selectedWords[selectedWords.length - 1];
    setSelectedWords(prev => prev.slice(0, prev.length - 1));
    setAvailableWords(prev => [...prev, wordToReturn]);
    audio.playTone(380, 0.15, 'triangle', 0.15);
  };

  // Reset Sub-reto 3.1
  const handleResetQuote = () => {
    setSelectedWords([]);
    setQuoteRevealed(false);
    setQuoteError(false);
    setAvailableWords(initialScramble);
    audio.playTone(320, 0.18, 'sine', 0.15);
  };

  // Sub-reto 3.2 Matching
  const handleSelectStartItem = (id: string) => {
    if (matchedPairIds.includes(id) || matchError) return;
    setSelectedStart(id);

    if (selectedEnding) {
      checkConfessionMatch(id, selectedEnding);
    } else {
      audio.playTone(523, 0.12, 'sine', 0.15);
    }
  };

  const handleSelectEndingItem = (endingText: string) => {
    const isAlreadyMatched = CONFESSION_PAIRS.some(
      p => p.ending === endingText && matchedPairIds.includes(p.id)
    );
    if (isAlreadyMatched || matchError) return;
    setSelectedEnding(endingText);

    if (selectedStart) {
      checkConfessionMatch(selectedStart, endingText);
    } else {
      audio.playTone(587, 0.12, 'sine', 0.15);
    }
  };

  const checkConfessionMatch = (startId: string, endingText: string) => {
    const pair = CONFESSION_PAIRS.find(p => p.id === startId);
    if (pair && pair.ending === endingText) {
      audio.playTone(659, 0.28, 'triangle', 0.25);
      const nextMatched = [...matchedPairIds, startId];
      setMatchedPairIds(nextMatched);
      setSelectedStart(null);
      setSelectedEnding(null);

      if (nextMatched.length === CONFESSION_PAIRS.length) {
        audio.playSuccess();
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#EC4899', '#C084FC']
        });
        onSetCompanions(
          "¡Conexión perfecta con el corazón de la serie! 💖 Eres una verdadera experta Susana.",
          "¡Vieron eso! ¡Se sabe los diálogos exactos de memoria! A celebrar crack 🔥",
          'victory'
        );
      } else {
        onSetCompanions(
          "¡Confesión unida! Busca la siguiente conexión de amor...",
          "¡Bien conectada esa frase! Dale al siguiente diálogo.",
          'idle'
        );
      }
    } else {
      audio.playDissonantError();
      setMatchError(true);
      onSetCompanions(
        "Ese remate no corresponde a esa confesión hermosa... Piensa en la intensidad del momento 🌸",
        "¡No me cruces los diálogos mi reina! 🥊 Intenta enlazar la correcta.",
        'error'
      );
      setTimeout(() => {
        setSelectedStart(null);
        setSelectedEnding(null);
        setMatchError(false);
      }, 750);
    }
  };

  // Sub-reto 3.3 Handler
  const handleSelectSpecialDetail = (choiceId: string) => {
    setSelectedSpecialDetail(choiceId);
    if (choiceId === 'correct') {
      audio.playSuccess();
      setSpecialDetailSuccess(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#E879F9', '#F472B6', '#38BDF8', '#C084FC']
      });
      onComplete();
      onSetCompanions(
        "¡Qué escena tan hermosa y conmovedora! 😭💖 Has conquistado el corazón de Reina de las Lágrimas.",
        "¡Nombre, Susana es la reina indiscutible de esta serie! ¡Desbloqueaste el Lore de Ari y Rivers! 🥊✨",
        'victory'
      );
    } else {
      audio.playDissonantError();
      onSetCompanions(
        "¡No hermosa, esa no era la razón! Recuerda lo que Hyun-woo le dijo con lágrimas en los ojos 🌸",
        "¡Casi te creo! Pero esa no era la promesa de amor, dale a la otra 🥊",
        'error'
      );
    }
  };

  const is3_2Done = matchedPairIds.length === CONFESSION_PAIRS.length;

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Level Header Banner */}
      <div className="glass-panel rounded-2xl p-4 border border-purple-400/30 relative overflow-hidden bg-gradient-to-br from-neutral-900/90 via-purple-950/30 to-rose-950/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" /> Nivel 3 • Notas Personales
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-500/20">
            {subPhase === 1
              ? 'Fase 3.1: Capítulo 12'
              : subPhase === 2
              ? 'Fase 3.2: Confesiones'
              : 'Fase 3.3: El Trébol & Recuerdos'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <span>Reina de las Lágrimas</span>
            <span className="text-xs px-2 py-0.5 rounded bg-purple-600/30 text-purple-200 font-mono">눈물의 여왕</span>
          </h2>
          <button
            onClick={handlePlayOST}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all tap-btn ${
              isPlayingOST
                ? 'bg-purple-600 border-white text-white shadow-neon'
                : 'bg-black/40 hover:bg-white/10 text-purple-300 border-purple-400/30'
            }`}
            title="Escuchar tema instrumental de la serie"
          >
            <Music2 className={`w-3.5 h-3.5 ${isPlayingOST ? 'animate-spin' : ''}`} />
            <span className="text-[10px] hidden sm:inline">{isPlayingOST ? 'Sonando OST...' : 'Escuchar OST'}</span>
          </button>
        </div>
        <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
          {subPhase === 1
            ? 'Reconstruye la frase más conmovedora de la serie pulsando las palabras en su orden poético exacto.'
            : subPhase === 2
            ? 'El Enlace de las Confesiones: Conecta cada pregunta con su remate poético en tus notas personales.'
            : 'El Trébol de los Recuerdos: El momento que selló la promesa de amor eterno de Hae-in y Hyun-woo.'}
        </p>
      </div>

      {/* SUB-RETO 3.1: Reconstrucción del Capítulo 12 */}
      {subPhase === 1 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-[#121318] border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden">
          {/* Reference Image from the Series: Umbrella Scene */}
          <div className="relative rounded-xl overflow-hidden mb-4 border border-purple-400/20 shadow-md group">
            <img
              src="./imagenes/qot-umbrella.jpg"
              alt="Baek Hyun-woo & Hong Hae-in bajo el paraguas"
              className="w-full h-36 sm:h-44 object-cover object-center filter brightness-95 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-black/30" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px]">
              <span className="text-purple-200 font-serif italic bg-black/60 px-2.5 py-1 rounded-full border border-purple-400/30 backdrop-blur-sm">
                🌧️ "Incluso bajo la tormenta... siempre estaré a tu lado"
              </span>
              <span className="text-[10px] font-mono text-gray-300 hidden sm:inline bg-black/50 px-2 py-0.5 rounded">
                Seúl • Escena del Paraguas
              </span>
            </div>
          </div>

          {/* Notepad Header Styling */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-purple-400 fill-purple-400" />
              <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                Bloc de Notas • Citas Guardadas
              </span>
            </div>
            {selectedWords.length > 0 && !quoteRevealed && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemoveLastWord}
                  className="text-[11px] text-gray-400 hover:text-rose-300 flex items-center gap-0.5 tap-btn transition-colors"
                  title="Deshacer última palabra"
                >
                  <RotateCcw className="w-3 h-3" /> Deshacer
                </button>
                <button
                  onClick={handleResetQuote}
                  className="text-[11px] text-gray-400 hover:text-white flex items-center gap-0.5 tap-btn transition-colors"
                  title="Reiniciar frase completa"
                >
                  Reiniciar
                </button>
              </div>
            )}
          </div>

          {/* Notepad Area: Formed Quote */}
          <div
            className={`min-h-32 p-4 rounded-xl bg-[#090A0E] border relative flex flex-col justify-between transition-all duration-300 ${
              quoteError
                ? 'border-rose-500 shadow-[0_0_24px_rgba(244,63,94,0.4)] ring-2 ring-rose-500/30'
                : quoteRevealed
                ? 'border-purple-400/60 shadow-[0_0_30px_rgba(192,132,252,0.3)] bg-[#0c0a14]'
                : 'border-white/10'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Quote className="w-5 h-5 text-purple-400/50 shrink-0 mt-0.5" />
              <div className="flex-1">
                {selectedWords.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-4 leading-relaxed font-serif">
                    (Toca las palabras desordenadas de abajo en el orden poético correcto para formar la frase...)
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {selectedWords.map((w, i) => (
                      <span
                        key={i}
                        className={`text-sm sm:text-base font-serif italic text-purple-100 transition-all ${
                          i === selectedWords.length - 1 ? 'font-bold text-white' : ''
                        }`}
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Revealed Chapter Subtitle */}
            {quoteRevealed && (
              <div className="mt-4 pt-3 border-t border-purple-500/25 flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
                  <span className="text-xs sm:text-sm font-mono font-bold text-purple-200 tracking-wider">
                    [la reina de las lágrimas, capítulo 12]
                  </span>
                </div>
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
              </div>
            )}
          </div>

          {/* Words Pool */}
          {!quoteRevealed && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                  Palabras disponibles para ordenar:
                </span>
                <span className="text-[10px] font-mono text-purple-300">
                  {selectedWords.length} / {TARGET_WORDS.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {availableWords.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    onClick={() => handleSelectWord(word, idx)}
                    className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-purple-950/70 text-gray-200 hover:text-white border border-white/10 hover:border-purple-400/50 text-xs sm:text-sm font-medium transition-all tap-btn shadow-sm hover:scale-105 active:scale-95"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Next Button after Quote Reveal */}
          {quoteRevealed && (
            <div className="mt-5 pt-3 border-t border-white/10 animate-fadeIn">
              <button
                onClick={() => setSubPhase(2)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-rose-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-neonStrong tap-btn flex items-center justify-center gap-2"
              >
                <span>CONTINUAR A: EL ENLACE DE LAS CONFESIONES ➜</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-RETO 3.2: El Enlace de las Confesiones (100% Celular Friendly) */}
      {subPhase === 2 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-[#121318] border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative">
          {/* Reference Image: Lavender Fields in Germany */}
          <div className="relative rounded-xl overflow-hidden mb-4 border border-purple-400/20 shadow-md">
            <img
              src="./imagenes/qot-lavender.jpg"
              alt="Hong Hae-in & Baek Hyun-woo en los campos de lavanda de Alemania"
              className="w-full h-36 sm:h-44 object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-black/20" />
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px]">
              <span className="text-purple-200 font-serif italic bg-black/60 px-2.5 py-1 rounded-full border border-purple-400/30 backdrop-blur-sm">
                🌸 Alemania • Recuerdos que el corazón jamás olvida
              </span>
              <span className="text-[10px] font-mono text-purple-300 bg-black/50 px-2 py-0.5 rounded">
                {matchedPairIds.length} / 3 Enlazados
              </span>
            </div>
          </div>

          {/* Notepad Header Styling */}
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-rose-400 fill-rose-400" />
              <span className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider">
                El Enlace de las Confesiones
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-billieLime">
              {matchedPairIds.length === 3 ? '¡Completado! ✓' : `${3 - matchedPairIds.length} pendientes`}
            </span>
          </div>

          {/* Clean Mobile Friendly Instructions */}
          <div className="p-2.5 rounded-xl bg-purple-950/25 border border-purple-400/20 mb-3 text-[11px] text-gray-300 leading-relaxed">
            <span className="text-purple-300 font-bold block mb-0.5">Cómo jugar en tu móvil:</span>
            <span>1️⃣ Toca una <b>frase inicial</b> (bloque izquierdo).</span>
            <br />
            <span>2️⃣ Toca su <b>remate poético exacto</b> (bloque derecho) para unirlos.</span>
          </div>

          {/* Mobile Side-by-Side Grid (grid-cols-2) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Left Column: Starts */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase text-purple-300 tracking-wider">
                  1. Confesión:
                </span>
              </div>
              {CONFESSION_PAIRS.map((pair, idx) => {
                const isMatched = matchedPairIds.includes(pair.id);
                const isSelected = selectedStart === pair.id;
                const isErrorOnThis = isSelected && matchError;

                return (
                  <button
                    key={pair.id}
                    onClick={() => handleSelectStartItem(pair.id)}
                    disabled={isMatched || matchError}
                    className={`w-full min-h-[76px] p-2.5 rounded-xl text-left border transition-all tap-btn relative flex flex-col justify-between ${
                      isMatched
                        ? 'bg-purple-950/50 text-purple-300 border-purple-500/50 opacity-80'
                        : isErrorOnThis
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 animate-shake'
                        : isSelected
                        ? 'bg-purple-600 text-white border-white shadow-neon ring-2 ring-purple-400/50 scale-[1.02]'
                        : 'bg-black/60 hover:bg-white/10 text-gray-200 border-white/10 hover:border-purple-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-purple-200 font-bold">
                        #{idx + 1}
                      </span>
                      {isMatched && <Check className="w-3.5 h-3.5 text-billieLime" />}
                      {isErrorOnThis && <X className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                    <p className="text-[11px] sm:text-xs font-serif italic leading-snug">
                      "{pair.start}"
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Endings */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase text-rose-300 tracking-wider">
                  2. Remate exacto:
                </span>
              </div>
              {shuffledEndings.map((ending, idx) => {
                const isAlreadyMatched = CONFESSION_PAIRS.some(
                  p => p.ending === ending && matchedPairIds.includes(p.id)
                );
                const isSelected = selectedEnding === ending;
                const isErrorOnThis = isSelected && matchError;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectEndingItem(ending)}
                    disabled={isAlreadyMatched || matchError}
                    className={`w-full min-h-[76px] p-2.5 rounded-xl text-left border transition-all tap-btn relative flex flex-col justify-between ${
                      isAlreadyMatched
                        ? 'bg-purple-950/50 text-purple-300 border-purple-500/50 opacity-80'
                        : isErrorOnThis
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/50 animate-shake'
                        : isSelected
                        ? 'bg-rose-600 text-white border-white shadow-neon ring-2 ring-rose-400/50 scale-[1.02]'
                        : 'bg-black/60 hover:bg-white/10 text-gray-200 border-white/10 hover:border-rose-400/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-rose-200 font-bold">
                        Opción {idx + 1}
                      </span>
                      {isAlreadyMatched && <Check className="w-3.5 h-3.5 text-billieLime" />}
                      {isErrorOnThis && <X className="w-3.5 h-3.5 text-rose-400" />}
                    </div>
                    <p className="text-[11px] sm:text-xs font-serif italic leading-snug">
                      "{ending}"
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue to Subphase 3.3 button */}
          {is3_2Done && (
            <div className="mt-5 pt-3 border-t border-white/10 flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-billieLime text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Todas las Confesiones Enlazadas con Éxito!</span>
              </div>
              <button
                onClick={() => setSubPhase(3)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-rose-500 text-white font-extrabold text-xs tracking-wider transition-all shadow-neonStrong tap-btn flex items-center justify-center gap-2"
              >
                <span>CONTINUAR A: EL TRÉBOL DE LOS RECUERDOS 🍀 ➜</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-RETO 3.3: El Trébol de los Recuerdos & Detalle Inolvidable */}
      {subPhase === 3 && (
        <div className="rounded-2xl p-4 sm:p-5 bg-[#121318] border border-purple-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative animate-fadeIn">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-base">🍀</span>
              <span className="text-xs font-mono font-bold text-purple-300 uppercase tracking-wider">
                El Trébol de los Milagros • Promesa Final
              </span>
            </div>
            <span className="text-xs font-mono text-purple-300 font-bold">
              Fase Final
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/40 via-neutral-900 to-rose-950/40 border border-purple-400/25 mb-4 text-center space-y-1.5">
            <span className="text-2xl block animate-pulse">🍀✨</span>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              ¿Por qué Baek Hyun-woo grabó el video mensaje en su teléfono para Hae-in?
            </h3>
            <p className="text-[11px] text-gray-300 leading-relaxed font-serif italic">
              "Si despiertas y no me recuerdas... por favor mira este video primero."
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {[
              {
                id: 'correct',
                text: 'Para recordarle que, sin importar lo que el destino traiga ni si pierde sus recuerdos, él siempre estará ahí amándola y esperando por ella con todo su ser.',
                tag: 'Promesa de Amor Incondicional 💖',
              },
              {
                id: 'wrong1',
                text: 'Para explicarle cómo manejar la empresa Queens y la lista de accionistas familiares.',
                tag: 'Trámites de Queens Group 🏢',
              },
              {
                id: 'wrong2',
                text: 'Para pedirle que le comprara un auto nuevo cuando regresaran a Corea.',
                tag: 'Cosas materiales 🚗',
              },
            ].map((opt) => {
              const isChosen = selectedSpecialDetail === opt.id;
              const isSuccess = isChosen && specialDetailSuccess;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectSpecialDetail(opt.id)}
                  disabled={specialDetailSuccess}
                  className={`w-full p-3 rounded-xl text-left border transition-all tap-btn ${
                    isSuccess
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-white shadow-neon'
                      : isChosen && !isSuccess
                      ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                      : 'bg-black/60 hover:bg-white/10 text-gray-200 border-white/10 hover:border-purple-400/40'
                  }`}
                >
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-purple-200 uppercase block mb-1 w-max">
                    {opt.tag}
                  </span>
                  <p className="text-xs font-medium leading-relaxed">{opt.text}</p>
                </button>
              );
            })}
          </div>

          {/* Completion & Advance Button: ONLY appears when Sub-reto 3.3 is solved! */}
          {specialDetailSuccess && (
            <div className="mt-5 pt-3 border-t border-white/10 flex flex-col gap-2.5 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-billieLime text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Reina de las Lágrimas Superado con la Máxima Puntuación!</span>
              </div>
              <button
                onClick={onAdvance}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-extrabold text-sm tracking-wide transition-all shadow-neonStrong tap-btn flex items-center justify-center gap-2"
              >
                <span>PASAR AL NIVEL 4: EL LORE DE ARIRIVERS ➜</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
