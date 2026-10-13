import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Cat,
  Gamepad2,
  Music,
  Flame,
  ArrowRight,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audio } from '../utils/audio';
import { CompanionMood } from '../types';

interface IntroWelcomeQuizProps {
  onComplete: () => void;
  onSetCompanions: (ari: string, rivers: string, mood: CompanionMood) => void;
}

interface IntroQuestion {
  id: number;
  icon: React.ReactNode;
  category: string;
  badgeColor: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    hint?: string;
  }[];
}

const INTRO_QUESTIONS: IntroQuestion[] = [
  {
    id: 1,
    icon: <Cat className="w-4 h-4 text-amber-400" />,
    category: 'Pregunta 1 • Familia Felina',
    badgeColor: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
    question: '1. ¿Cómo se llaman tus hermosos e inseparables gatos?',
    options: [
      { id: 'a', text: 'Tom y Vida', isCorrect: true },
      { id: 'b', text: 'Michi y Pelusa', isCorrect: false, hint: '¡Oye, no me cambies a tus bendiciones felinas!' },
      { id: 'c', text: 'Luna y Salem', isCorrect: false, hint: 'Nombre, esos son gatos de película mágica jaja' },
      { id: 'd', text: 'Simba y Nala', isCorrect: false, hint: 'Esos son del Rey León, piensa en los tuyos' },
    ],
  },
  {
    id: 2,
    icon: <Gamepad2 className="w-4 h-4 text-emerald-400" />,
    category: 'Pregunta 2 • Amistades de Leyenda',
    badgeColor: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
    question: '2. ¿Cómo se llama tu amigo furro, kpoper de K-dramas y adicto al LoL?',
    options: [
      { id: 'a', text: 'Oswaldo', isCorrect: true },
      { id: 'b', text: 'Faker', isCorrect: true },
      { id: 'c', text: 'Keria', isCorrect: false, hint: 'Keria es soporte de T1, pero no es tu compa' },
      { id: 'd', text: 'ShowMaker', isCorrect: false, hint: 'ShowMaker juega mid pero no es tu amigo' },
    ],
  },
  {
    id: 3,
    icon: <Music className="w-4 h-4 text-stringC" />,
    category: 'Pregunta 3 • Pasión Musical',
    badgeColor: 'border-sky-400/40 text-sky-300 bg-sky-500/10',
    question: '3. ¿Qué instrumento musical tocas con tanta pasión, maestría y elegancia?',
    options: [
      { id: 'a', text: 'La viola', isCorrect: true },
      { id: 'b', text: 'El violín', isCorrect: false, hint: '¡Jamás confundas la noble viola con el violín!' },
      { id: 'c', text: 'El violonchelo', isCorrect: false, hint: 'El violonchelo es más grande y va al piso' },
      { id: 'd', text: 'El ukelele', isCorrect: false, hint: 'Muy playero pero no es tu instrumento de orquesta' },
    ],
  },
  {
    id: 4,
    icon: <Heart className="w-4 h-4 text-rose-400" />,
    category: 'Pregunta 4 • Ships Canónicos',
    badgeColor: 'border-rose-400/40 text-rose-300 bg-rose-500/10',
    question: '4. ¿Cuál es tu ship lésbico actual favorito en todo el universo?',
    options: [
      { id: 'a', text: 'Ari y Rivers (Aririvers)', isCorrect: true },
      { id: 'b', text: 'Rue y Jules (Euphoria)', isCorrect: false, hint: '¡Gran ship de Euphoria, pero hay una dupla streamer que amas más!' },
      { id: 'c', text: 'Lumity (Luz y Amity)', isCorrect: false, hint: '¡Hermoso ship de The Owl House, pero piensa en las streamers!' },
      { id: 'd', text: 'Bubbline (Marceline y Dulce Princesa)', isCorrect: false, hint: 'Clásico legendario de Adventure Time, ¡pero sabes cuál es tu número 1!' },
    ],
  },
];

export const IntroWelcomeQuiz: React.FC<IntroWelcomeQuizProps> = ({
  onComplete,
  onSetCompanions,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const currentQ = INTRO_QUESTIONS[currentQIndex];

  const handleSelectOption = (optId: string) => {
    const opt = currentQ.options.find(o => o.id === optId);
    if (!opt) return;

    setSelectedOptId(optId);

    if (opt.isCorrect) {
      audio.playSuccess();
      setHasError(false);
      setFeedbackText(null);

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.65 }
      });

      // Update companion dialogue per question
      if (currentQ.id === 1) {
        onSetCompanions(
          "¡Awww Tom y Vida! 🐱💖 Los reyes de la casa. ¡Pregunta 1 perfecta!",
          "¡Esaaa patrona de los michis! Dale a la siguiente crack 🥊",
          'victory'
        );
      } else if (currentQ.id === 2) {
        if (opt.text === 'Faker') {
          onSetCompanions(
            "¡Faker, el Rey Demonio Inmortal! 🎮 ¡Ese compa también cuenta como leyenda total!",
            "¡Faker el mero mero de T1! ¡Respuesta aprobada con honores crack! 🔥",
            'victory'
          );
        } else {
          onSetCompanions(
            "¡Jajaja Oswaldo! Un saludazo para el compa furro y kpoper ✨",
            "¡El mismísimo Oswaldo! Sabíamos que no le ibas a fallar 🔥",
            'victory'
          );
        }
      } else if (currentQ.id === 3) {
        onSetCompanions(
          "¡LA VIOLA! 🎻 El instrumento más hermoso y profundo de todos.",
          "¡Esa viola suena durísimo! Ya casi completas el test de acceso 🥊",
          'victory'
        );
      } else if (currentQ.id === 4) {
        onSetCompanions(
          "¡ARIRIVERS CANON DE POR VIDA! 💖🥺 ¡Confirmadísimo Susana hermosa!",
          "¡A HUEVO! ¡Aririvers la dupla suprema! ¡Identidad 100% verificada! 🔥",
          'victory'
        );
      }

      setTimeout(() => {
        if (currentQIndex < INTRO_QUESTIONS.length - 1) {
          setCurrentQIndex(prev => prev + 1);
          setSelectedOptId(null);
        } else {
          setIsQuizCompleted(true);
          audio.playSuccess();
          audio.playApplause();
          confetti({
            particleCount: 80,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#C6F135', '#A855F7', '#EC4899', '#38BDF8']
          });
        }
      }, 1000);
    } else {
      audio.playDissonantError();
      setHasError(true);
      setFeedbackText(opt.hint || '¡Intenta con otra opción!');
      onSetCompanions(
        "¡Casi casi hermosa! Piensa bien la respuesta... 🌸",
        "¡Aguanta el click! Esa no es mi reina, prueba otra vez 🥊",
        'error'
      );
      setTimeout(() => {
        setSelectedOptId(null);
        setHasError(false);
      }, 700);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Welcome Intro Header Card */}
      <div className="glass-panel-neon rounded-2xl p-5 border border-billieLime/40 text-center relative overflow-hidden bg-gradient-to-b from-[#13151D] via-[#101217] to-[#0A0B0E]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-billieLime/15 border border-billieLime/30 text-billieLime text-xs font-bold uppercase tracking-wider mb-2 shadow-neon">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Para ver si es la cumpleañera</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-white flex items-center justify-center gap-2">
          <span>¿Eres la cumpleañera?</span>
          <Sparkles className="w-5 h-5 text-billieLime animate-pulse" />
        </h1>
        <p className="text-xs text-gray-300 mt-1 max-w-sm mx-auto leading-relaxed">
          Responde estas preguntas sencillas para ver si de verdad eres la cumpleañera de este 13 de octubre.
        </p>

        {/* Progress Dots */}
        {!isQuizCompleted && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {INTRO_QUESTIONS.map((q, idx) => (
              <div
                key={q.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentQIndex === idx
                    ? 'w-7 bg-billieLime shadow-neon'
                    : currentQIndex > idx
                    ? 'w-2 bg-emerald-400'
                    : 'w-2 bg-white/15'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* QUESTION CARD */}
      {!isQuizCompleted ? (
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <span
              className={`text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${currentQ.badgeColor}`}
            >
              {currentQ.icon}
              <span>{currentQ.category}</span>
            </span>
            <span className="text-xs font-mono text-gray-400 font-bold">
              {currentQIndex + 1} de {INTRO_QUESTIONS.length}
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-white mb-4 leading-relaxed">
            {currentQ.question}
          </h2>

          {feedbackText && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold mb-3 animate-fadeIn flex items-center gap-1.5">
              <span>⚠️</span>
              <span>{feedbackText}</span>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOptId === opt.id;
              const isCorrect = isSelected && opt.isCorrect;
              const isWrong = isSelected && hasError;

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={selectedOptId !== null}
                  className={`w-full p-3.5 rounded-xl text-left border transition-all tap-btn relative flex items-center justify-between ${
                    isCorrect
                      ? 'bg-billieLime text-black border-billieLime shadow-neon scale-[1.01]'
                      : isWrong
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/40 animate-shake'
                      : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-billieLime/40'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-semibold leading-snug">
                    {opt.text}
                  </span>
                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-black shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* CELEBRATION & WELCOME PRESENTATION CARD */
        <div className="glass-panel-neon rounded-2xl p-5 border border-billieLime/40 text-center space-y-4 animate-fadeIn bg-gradient-to-br from-[#12141C] via-[#1A1325] to-[#141F1A]">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-billieLime to-emerald-400 p-0.5 shadow-neon animate-bounce">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-billieLime" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>¡Eres la cumpleañera!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              ¡Bienvenida a The Birthday Quest, Susana! 🎂✨
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed max-w-sm mx-auto">
              Has respondido con exactitud absoluta: mamá de <b>Tom y Vida</b>, amiga del gran <b>Oswaldo</b>, maestra de la <b>viola</b> y fan número uno de <b>Ari y Rivers</b>.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 text-left space-y-2 text-xs text-gray-300">
            <span className="text-[11px] uppercase font-bold text-billieLime tracking-wider block">
              Tus 5 Misiones de Cumpleaños te esperan:
            </span>
            <ul className="space-y-1.5 text-[11px] sm:text-xs">
              <li className="flex items-center gap-2">
                <span>🎻</span> <b>Nivel 1:</b> El Enigma de la Viola (Lectura, Oído & Minijuego)
              </li>
              <li className="flex items-center gap-2">
                <span>🟢</span> <b>Nivel 2:</b> El Laboratorio Sonoro de Billie Eilish
              </li>
              <li className="flex items-center gap-2">
                <span>👑</span> <b>Nivel 3:</b> Reina de las Lágrimas (Cap. 12 & Confesiones)
              </li>
              <li className="flex items-center gap-2">
                <span>💖</span> <b>Nivel 4:</b> El Lore de Ari & Rivers (Edits & Trivia)
              </li>
              <li className="flex items-center gap-2">
                <span>🎁</span> <b>Nivel 5:</b> Tu Regalo Final & Álbum de Recuerdos
              </li>
            </ul>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-billieLime via-emerald-400 to-billieLime text-black font-black text-sm tracking-wider uppercase transition-all shadow-neonStrong hover:scale-[1.02] active:scale-[0.98] tap-btn flex items-center justify-center gap-2"
          >
            <span>¡EMPEZAR EL NIVEL 1: LA VIOLA! 🎻 ➜</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};
