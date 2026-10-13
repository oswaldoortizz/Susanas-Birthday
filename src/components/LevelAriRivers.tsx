import React, { useState } from 'react';
import { Heart, Flame, Sparkles, CheckCircle2, MessageSquare, Award } from 'lucide-react';
import { audio } from '../utils/audio';
import { CompanionMood } from '../types';

interface LevelAriRiversProps {
  onComplete: () => void;
  isCompleted: boolean;
  onAdvance: () => void;
  onSetCompanions: (ari: string, rivers: string, mood: CompanionMood) => void;
}

interface MatchPair {
  id: string;
  moment: string;
  tag: string;
  matchingPhrase: string;
}

const MATCH_PAIRS: MatchPair[] = [
  {
    id: 'p1',
    moment: 'Los edits virales de TikTok con miradas cómplices',
    tag: 'TikTok Lore',
    matchingPhrase: 'El chat entero comentando: ¡Por favor ya confírmenlo! 💕',
  },
  {
    id: 'p2',
    moment: 'La Velada del Año tras el ring de boxeo',
    tag: 'Evento Presencial',
    matchingPhrase: 'Abrazo eterno con lágrimas y orgullo en primera fila 🥊',
  },
  {
    id: 'p3',
    moment: 'Las bromas de celos cuando otra streamer entra a la llamada',
    tag: 'Dinámica de Stream',
    matchingPhrase: 'Rivers haciéndose la ofendida y Ari muriéndose de risa 😂',
  },
];

interface StreamTriviaQ {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
}

const STREAM_TRIVIA: StreamTriviaQ[] = [
  {
    id: 1,
    question: 'En los streams compartidos, ¿quién suele soltar los comentarios de broma más atrevidos y quién se pone tímida?',
    options: [
      {
        id: 'a',
        text: 'Rivers suelta el comentario con confianza y Ari se tapa la cara riéndose con timidez 💕',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'Ambas se quedan serias mirando la pantalla en silencio',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Ari reta a Rivers a una pelea de boxeo en la sala',
        isCorrect: false,
      },
    ],
  },
  {
    id: 2,
    question: 'Cuando viajan juntas a eventos internacionales, ¿cuál es la dinámica sagrada en sus historias de Instagram?',
    options: [
      {
        id: 'a',
        text: 'Salir juntas compartiendo comida, abrazos y haciendo reír a todo el fandom 🌟',
        isCorrect: true,
      },
      {
        id: 'b',
        text: 'Fingir que no se conocen y sentarse en esquinas opuestas',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Solo subir fotos de aviones vacíos',
        isCorrect: false,
      },
    ],
  },
];

export const LevelAriRivers: React.FC<LevelAriRiversProps> = ({
  onComplete,
  isCompleted,
  onAdvance,
  onSetCompanions,
}) => {
  const [subPhase, setSubPhase] = useState<1 | 2>(1);

  // Match state
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);
  const [completedMatches, setCompletedMatches] = useState<string[]>([]);
  const [hasMatchError, setHasMatchError] = useState(false);

  // Shuffled phrases for right column
  const [shuffledPhrases] = useState<string[]>([
    MATCH_PAIRS[1].matchingPhrase,
    MATCH_PAIRS[0].matchingPhrase,
    MATCH_PAIRS[2].matchingPhrase,
  ]);

  // Trivia state
  const [triviaIdx, setTriviaIdx] = useState(0);
  const [selectedTriviaOpt, setSelectedTriviaOpt] = useState<string | null>(null);
  const [triviaFeedback, setTriviaFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);
  const [showHighFive, setShowHighFive] = useState(false);

  // Match interaction
  const handleSelectMoment = (id: string) => {
    if (completedMatches.includes(id)) return;
    setSelectedMoment(id);

    if (selectedPhrase) {
      checkPair(id, selectedPhrase);
    }
  };

  const handleSelectPhrase = (phrase: string) => {
    setSelectedPhrase(phrase);

    if (selectedMoment) {
      checkPair(selectedMoment, phrase);
    }
  };

  const checkPair = (momentId: string, phrase: string) => {
    const pair = MATCH_PAIRS.find(p => p.id === momentId);
    if (pair && pair.matchingPhrase === phrase) {
      audio.playTone(659, 0.25, 'triangle', 0.25);
      const nextCompleted = [...completedMatches, momentId];
      setCompletedMatches(nextCompleted);
      setSelectedMoment(null);
      setSelectedPhrase(null);

      if (nextCompleted.length === MATCH_PAIRS.length) {
        audio.playSuccess();
        onSetCompanions(
          "¡SIII Susana! 💖 Te sabes nuestros edits virales mejor que nosotras.",
          "¡Uff conexión directa con el chat! Ahora contéstame estas preguntas capciosas 🥊",
          'victory'
        );
        setTimeout(() => setSubPhase(2), 1200);
      } else {
        onSetCompanions(
          "¡Match canónico perfecto! Busca la siguiente pareja...",
          "¡Bien asociada esa anécdota crack! Dale a la que sigue.",
          'idle'
        );
      }
    } else {
      audio.playDissonantError();
      setHasMatchError(true);
      onSetCompanions(
        "¡Esa reacción no corresponde a ese momento hermosa! Piensa en los streams 🌸",
        "¡Aguanta! No me cambies el lore mi reina, inténtalo de nuevo 🥊",
        'error'
      );
      setTimeout(() => {
        setSelectedMoment(null);
        setSelectedPhrase(null);
        setHasMatchError(false);
      }, 700);
    }
  };

  // Trivia interaction
  const handleTriviaSelect = (optId: string) => {
    const currentQ = STREAM_TRIVIA[triviaIdx];
    const chosen = currentQ.options.find(o => o.id === optId);
    setSelectedTriviaOpt(optId);

    if (chosen?.isCorrect) {
      audio.playSuccess();
      setTriviaFeedback({ isSuccess: true, text: "¡Totalmente canon! Así es nuestra dinámica siempre." });
      onSetCompanions(
        "¡Exactamente así pasa! Rivers siempre empieza y yo me pongo súper roja 🥰",
        "¡Nombre te digo que Susana tiene línea directa con nosotras! 🔥",
        'victory'
      );

      setTimeout(() => {
        if (triviaIdx < STREAM_TRIVIA.length - 1) {
          setTriviaIdx(prev => prev + 1);
          setSelectedTriviaOpt(null);
          setTriviaFeedback(null);
        } else {
          setShowHighFive(true);
          onComplete();
          onSetCompanions(
            "¡SUSANA LO LOGRASTE! 🎂💖 ¡Has superado todas las misiones! El regalo final es todo tuyo.",
            "¡CHOCA ESAS MANOS CAMPEONA! 🙏🥊 ¡Desbloquea tu regalo que te mereces el universo entero!",
            'victory'
          );
        }
      }, 1400);
    } else {
      audio.playDissonantError();
      setTriviaFeedback({ isSuccess: false, text: "No, en stream jamás pasa eso. ¡Piensa en cómo somos!" });
      onSetCompanions(
        "¡Noooo Susana! ¡Nosotras no somos así en directo jaja! 😂",
        "¡Nombre qué va! Piénsale tantito y vuelve a elegir.",
        'error'
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Header Banner with Lesbian Sunset Aesthetics */}
      <div className="glass-panel-lesbian rounded-2xl p-4 border border-pink-400/30 relative overflow-hidden bg-gradient-to-br from-[#1C1218]/90 via-[#261520]/80 to-[#19101E]/90">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-pink-300 uppercase tracking-wider flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" /> Nivel 4 • Lore de AriRivers
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400/20 via-pink-400/20 to-purple-400/20 text-pink-200 border border-pink-400/30">
            {subPhase === 1 ? 'Fase 4.1: Match' : 'Fase 4.2: Trivia'}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <span>El Lore de Ari & Rivers</span>
          <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
        </h2>
        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
          {subPhase === 1
            ? 'Susana, conecta cada momento legendario de nuestro lore con su reacción canónica correspondiente.'
            : 'Preguntas capciosas sobre nuestras transmisiones. Responde con sabiduría streamer para liberar tu regalo.'}
        </p>
      </div>

      {/* PHASE 4.1: Match de Momentos y Edits */}
      {subPhase === 1 ? (
        <div className="glass-panel-lesbian rounded-2xl p-4 border border-pink-400/20 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-300" />
              <span>Match de Momentos y Frases</span>
            </span>
            <span className="text-xs font-mono text-pink-300 font-bold">
              {completedMatches.length} / 3 Asociados
            </span>
          </div>

          <p className="text-[11px] text-gray-300 mb-3">
            Toca un momento de la columna izquierda y luego su frase canónica de la derecha:
          </p>

          {/* Matching Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Column A: Moments */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-orange-300 tracking-wider block">
                Momentos Legendarios:
              </span>
              {MATCH_PAIRS.map((pair) => {
                const isMatched = completedMatches.includes(pair.id);
                const isSelected = selectedMoment === pair.id;

                return (
                  <button
                    key={pair.id}
                    onClick={() => handleSelectMoment(pair.id)}
                    disabled={isMatched}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all tap-btn ${
                      isMatched
                        ? 'bg-purple-950/40 text-pink-200 border-pink-500/40 opacity-75'
                        : isSelected
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-white shadow-neonSunset scale-[1.01]'
                        : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-orange-400/30'
                    }`}
                  >
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-orange-300 uppercase block mb-1 w-max border border-orange-400/20">
                      {pair.tag}
                    </span>
                    <p className="text-xs font-semibold leading-snug">{pair.moment}</p>
                  </button>
                );
              })}
            </div>

            {/* Column B: Phrases */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase text-pink-300 tracking-wider block">
                Reacciones Canónicas:
              </span>
              {shuffledPhrases.map((phrase, idx) => {
                const isAlreadyMatched = MATCH_PAIRS.some(
                  p => p.matchingPhrase === phrase && completedMatches.includes(p.id)
                );
                const isSelected = selectedPhrase === phrase;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectPhrase(phrase)}
                    disabled={isAlreadyMatched}
                    className={`w-full p-2.5 rounded-xl text-left border transition-all tap-btn ${
                      isAlreadyMatched
                        ? 'bg-purple-950/40 text-pink-200 border-pink-500/40 opacity-75'
                        : isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-white shadow-neonPink scale-[1.01]'
                        : hasMatchError
                        ? 'border-rose-500'
                        : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-pink-400/30'
                    }`}
                  >
                    <p className="text-xs font-semibold leading-snug">{phrase}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* PHASE 4.2: Stream Trivia */
        <div className="glass-panel-lesbian rounded-2xl p-4 border border-pink-400/30 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-400/20 to-pink-500/20 text-pink-200 border border-pink-400/30">
              Pregunta {triviaIdx + 1} de 2
            </span>
            <span className="text-xs text-pink-300 font-semibold flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
              <span>Humor Streamer</span>
            </span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white mb-3 leading-relaxed">
            {STREAM_TRIVIA[triviaIdx].question}
          </h3>

          {/* Feedback */}
          {triviaFeedback && (
            <div
              className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 mb-3 ${
                triviaFeedback.isSuccess
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30'
                  : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
              }`}
            >
              {triviaFeedback.isSuccess ? '✓ ' : '✕ '} {triviaFeedback.text}
            </div>
          )}

          {/* Options */}
          <div className="space-y-2">
            {STREAM_TRIVIA[triviaIdx].options.map((opt) => {
              const isChosen = selectedTriviaOpt === opt.id;
              const isCorrectFeedback = isChosen && triviaFeedback?.isSuccess;
              const isWrongFeedback = isChosen && triviaFeedback && !triviaFeedback.isSuccess;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleTriviaSelect(opt.id)}
                  disabled={isCompleted || (triviaFeedback?.isSuccess ?? false)}
                  className={`w-full p-3 rounded-xl text-left text-xs sm:text-sm font-medium flex items-start justify-between border transition-all tap-btn ${
                    isCorrectFeedback
                      ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 text-white border-white shadow-neonSunset'
                      : isWrongFeedback
                      ? 'bg-rose-900/40 text-rose-200 border-rose-500/40'
                      : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-pink-400/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center text-[10px] font-mono text-pink-300 uppercase shrink-0 mt-0.5 border border-pink-400/20">
                      {opt.id}
                    </span>
                    <span className="leading-snug">{opt.text}</span>
                  </div>
                  {isCorrectFeedback && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* High-Five Celebration Animation & Advance */}
          {showHighFive && (
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-3 animate-fadeIn">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-950/50 via-pink-950/60 to-purple-950/60 border border-pink-400/40 text-center animate-bounce shadow-neonPink">
                <span className="text-2xl block mb-1">🙏💥✨</span>
                <span className="text-xs font-black text-pink-200">
                  ¡ARI & RIVERS CHOCAN LAS MANOS EN PANTALLA POR SUSANA!
                </span>
              </div>

              <button
                onClick={onAdvance}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-white font-black text-sm tracking-wide transition-all shadow-neonStrong tap-btn flex items-center justify-center gap-2"
              >
                <span>¡DESBLOQUEAR EL REGALO FINAL! 🎁 ➜</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
