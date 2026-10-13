import React, { useState } from 'react';
import { Gamepad2, Heart, Award, Sparkles, CheckCircle2, MessageSquare, Flame } from 'lucide-react';
import { audio } from '../utils/audio';

interface LevelTriviaProps {
  onComplete: () => void;
  isCompleted: boolean;
  onAdvance: () => void;
  onSetReaction: (msg: { ari?: string; rivers?: string } | null) => void;
}

interface QuestionData {
  id: number;
  badge: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    ariReaction: string;
    riversReaction: string;
  }[];
}

const QUESTIONS: QuestionData[] = [
  {
    id: 1,
    badge: 'La Velada & Su Shippeo',
    question: '¿Cuál es la prueba definitiva de complicidad y amor incondicional entre Ari y Rivers que enamoró a todo el internet?',
    options: [
      {
        id: 'a',
        text: 'Ese abrazo eterno con lágrimas y emoción en primera fila tras la pelea de La Velada del Año 🥊💖',
        isCorrect: true,
        ariReaction: '¡SIII! Ese momento fue puro amor real y apoyo de por vida 🥰',
        riversReaction: '¡Claro que sí carajo! ¡El abrazo más sincero de la historia! 🔥',
      },
      {
        id: 'b',
        text: 'Un tweet diciendo que solo son compañeras de trabajo casuales',
        isCorrect: false,
        ariReaction: '¡Ay no! ¡Jamás! Nuestra amistad y conexión es demasiado especial 🥺',
        riversReaction: '¡Ni de chiste! ¡Nosotras nos queremos con el alma!',
      },
      {
        id: 'c',
        text: 'Que juegan Roblox sin prender la cámara',
        isCorrect: false,
        ariReaction: 'Jajaja no Susana, eso es muy random 😹',
        riversReaction: '¡Nombre qué va! ¡Prueba con la del abrazo legendario!',
      },
    ],
  },
  {
    id: 2,
    badge: 'Momento Streamer VIP',
    question: 'Si Ari y Rivers tuvieran a Susana en su stream el día de hoy, ¿qué dirían en vivo ante 150,000 personas?',
    options: [
      {
        id: 'a',
        text: '¡Que Susana es una reina talentosísima con su viola y la vibra más hermosa del planeta! 🎻👑',
        isCorrect: true,
        ariReaction: '¡Literalmente! Eres una diosa con esa viola y tu vibra ilumina todo ✨',
        riversReaction: '¡A huevo! ¡Susana la patrona indiscutible de la noche! 🥊🔥',
      },
      {
        id: 'b',
        text: 'Que tiene que dejar la viola y ponerse a jugar FIFA todo el día',
        isCorrect: false,
        ariReaction: '¡Jamás! ¡Nos encanta verla tocar su viola tan hermosa! 🌸',
        riversReaction: '¡No manches, esa viola es su superpoder!',
      },
      {
        id: 'c',
        text: 'Que se les olvidó que hoy era 13 de octubre',
        isCorrect: false,
        ariReaction: '¡Cómo se nos va a olvidar si hoy cumple la mejor! 🎂',
        riversReaction: '¡Fecha sagrada mi reina!',
      },
    ],
  },
  {
    id: 3,
    badge: 'Resolución de Cumple',
    question: '¿Cuál es el decreto oficial para celebrar los cumpleaños de Susana a partir de este 13 de Octubre?',
    options: [
      {
        id: 'a',
        text: '¡Festejo total con confeti, música, abrazos y desbloqueo de regalos especiales! 🎉🎁',
        isCorrect: true,
        ariReaction: '¡Decretadísimo! ¡Ahora sí Susana, libera tu regalo! 💖',
        riversReaction: '¡Rompiste el récord streamer! ¡Ábrete ese regalo ya mismo! 👑',
      },
      {
        id: 'b',
        text: 'Dormirse a las 8:00 pm sin pastel',
        isCorrect: false,
        ariReaction: '¡Noooo! ¡Hoy es noche de celebración total! 🎈',
        riversReaction: '¡Qué aburrido! ¡Elige la fiesta total!',
      },
      {
        id: 'c',
        text: 'Ver stream de matemáticas',
        isCorrect: false,
        ariReaction: 'Jajaja no inventes Susana 😂',
        riversReaction: '¡Ni yo aguanto eso! ¡Dale a festejar!',
      },
    ],
  },
];

export const LevelTrivia: React.FC<LevelTriviaProps> = ({
  onComplete,
  isCompleted,
  onAdvance,
  onSetReaction,
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  const activeQuestion = QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (optId: string) => {
    setSelectedOption(optId);
    const chosen = activeQuestion.options.find(o => o.id === optId);

    if (chosen?.isCorrect) {
      audio.playSuccess();
      setFeedback({ isSuccess: true, text: "¡Correcto! Respuesta 100% canon." });
      onSetReaction({
        ari: chosen.ariReaction,
        rivers: chosen.riversReaction,
      });

      setTimeout(() => {
        if (currentQuestionIdx < QUESTIONS.length - 1) {
          setCurrentQuestionIdx(prev => prev + 1);
          setSelectedOption(null);
          setFeedback(null);
        } else {
          // Completed trivia!
          onComplete();
          onSetReaction({
            ari: "¡SIII! ¡Te sabes todo el lore a la perfección Susana! 💖 ¡El regalo ya está listo!",
            rivers: "¡Eso mamona, 3 de 3! 🥊 Te ganaste el cinturón de campeona. ¡Desbloquea tu regalo!",
          });
        }
      }, 1400);
    } else {
      audio.playError();
      setFeedback({ isSuccess: false, text: "¡Incorrecto! Piensa en lo que dirían de verdad." });
      onSetReaction({
        ari: chosen?.ariReaction || "¡Prueba de nuevo Susana hermosa! 🌸",
        rivers: chosen?.riversReaction || "¡No te me distraigas mi reina! 🥊",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Level Header Banner */}
      <div className="glass-panel rounded-2xl p-4 border border-purple-500/30 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" /> Nivel 3: Twitch Stream Lore
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            {isCompleted ? "Completado ✓" : `Pregunta ${currentQuestionIdx + 1} de 3`}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <span>Trivia & Lore de Ari & Rivers</span>
          <Flame className="w-4 h-4 text-rose-400" />
        </h2>
        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
          Estilo stream interactivo. Demuestra cuánto sabes sobre las dos streamers más queridas y su química legendaria.
        </p>
      </div>

      {/* Streaming Chat & Ticker Box */}
      <div className="glass-panel rounded-2xl p-3 border border-white/10 space-y-2">
        {/* Stream Live Stats */}
        <div className="flex items-center justify-between text-[11px] pb-2 border-b border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-gray-300 font-mono">148,290 Espectadores</span>
          </div>
          <div className="flex items-center gap-1 text-billieLime font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Chat Modo Cumpleaños</span>
          </div>
        </div>

        {/* Live Twitch Chat Ticker */}
        <div className="bg-black/50 rounded-xl p-2.5 font-mono text-[11px] space-y-1 border border-white/5 max-h-24 overflow-y-auto">
          <div className="text-gray-300 flex items-center gap-1.5">
            <span className="text-purple-400 font-bold">AriFan_13:</span>
            <span>¡Susana es la más crack con la viola! 🎻✨</span>
          </div>
          <div className="text-gray-300 flex items-center gap-1.5">
            <span className="text-rose-400 font-bold">RiversArmy_MX:</span>
            <span>🥊 Hoy nadie le gana a la cumpleañera!!</span>
          </div>
          <div className="text-gray-300 flex items-center gap-1.5">
            <span className="text-billieLime font-bold">BillieVibes:</span>
            <span>Birds of a Feather en repeat para Susana 🟢</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-panel-neon rounded-2xl p-4 border border-rose-500/30 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            {activeQuestion.badge}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Lore Oficial</span>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-bold text-white mb-3 leading-relaxed">
          {activeQuestion.question}
        </p>

        {/* Feedback display */}
        {feedback && (
          <div
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 mb-3 ${
              feedback.isSuccess
                ? 'bg-billieLime/15 text-billieLime border border-billieLime/30'
                : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
            }`}
          >
            {feedback.isSuccess ? '✓ ' : '✕ '} {feedback.text}
          </div>
        )}

        {/* Options list */}
        <div className="space-y-2">
          {activeQuestion.options.map((opt) => {
            const isChosen = selectedOption === opt.id;
            const isCorrectFeedback = isChosen && feedback?.isSuccess;
            const isWrongFeedback = isChosen && feedback && !feedback.isSuccess;

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                disabled={isCompleted || (feedback?.isSuccess ?? false)}
                className={`w-full p-3 rounded-xl text-left text-xs sm:text-sm font-semibold flex items-start justify-between border transition-all tap-btn ${
                  isCorrectFeedback
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white border-white shadow-neon'
                    : isWrongFeedback
                    ? 'bg-rose-900/40 text-rose-200 border-rose-500/40'
                    : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-purple-400/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-black/40 flex items-center justify-center text-[10px] font-mono text-purple-300 uppercase shrink-0 mt-0.5">
                    {opt.id}
                  </span>
                  <span className="leading-snug">{opt.text}</span>
                </div>
                {isCorrectFeedback && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>

        {/* Completion Bar or Advance */}
        {isCompleted && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-center gap-2 text-billieLime text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>¡Trivia de Streamers Superada con Éxito!</span>
            </div>
            <button
              onClick={onAdvance}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-billieLime via-yellow-400 to-stringA text-black font-black text-sm tracking-wide transition-all shadow-neonStrong tap-btn flex items-center justify-center gap-2"
            >
              <span>¡DESBLOQUEAR EL REGALO FINAL! 🎁 ➜</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
