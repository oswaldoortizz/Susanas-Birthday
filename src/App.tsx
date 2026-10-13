import React, { useState, useEffect } from 'react';
import { GameStep, CompanionMood } from './types';
import { Header } from './components/Header';
import { FloatingMascots } from './components/FloatingMascots';
import { IntroWelcomeQuiz } from './components/IntroWelcomeQuiz';
import { LevelViola } from './components/LevelViola';
import { LevelBillie } from './components/LevelBillie';
import { LevelQueenOfTears } from './components/LevelQueenOfTears';
import { LevelAriRivers } from './components/LevelAriRivers';
import { LevelGift } from './components/LevelGift';
import { audio } from './utils/audio';
import { Heart, Music2, RotateCcw, Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';

export const App: React.FC = () => {
  // Intro quiz completion state:
  // Siempre arranca en el mini-cuestionario ("¿Eres la cumpleañera?") al iniciar o abrir la aplicación.
  // Persistimos en sessionStorage únicamente para la pestaña activa para no perder el estado ante recargas puntuales,
  // pero una nueva sesión o visita siempre comenzará con la verificación de cumpleaños.
  const [hasCompletedIntro, setHasCompletedIntro] = useState<boolean>(() => {
    try {
      // Limpiamos cualquier flag persistente antiguo en localStorage para evitar saltos indeseados
      localStorage.removeItem('susana_intro_completed');
      return sessionStorage.getItem('susana_intro_completed') === 'true';
    } catch (e) {}
    return false;
  });

  // 1. PERSISTENCIA EN LOCALSTORAGE ('currentLevel')
  const [currentStep, setCurrentStep] = useState<GameStep>(() => {
    try {
      const introDone = sessionStorage.getItem('susana_intro_completed') === 'true';
      if (!introDone) return 1;
      const saved = localStorage.getItem('currentLevel') || localStorage.getItem('susana_current_level');
      if (saved) {
        const num = Number(saved);
        if (num >= 1 && num <= 5) return num as GameStep;
      }
    } catch (e) {}
    return 1;
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const introDone = sessionStorage.getItem('susana_intro_completed') === 'true';
      if (!introDone) return [];
      const saved = localStorage.getItem('susana_completed_levels');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [isMuted, setIsMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('susana_sound_muted') === 'true';
    } catch (e) {}
    return false;
  });

  // Sync isMuted with audio manager on mount and change
  useEffect(() => {
    audio.setMuted(isMuted);
    localStorage.setItem('susana_sound_muted', String(isMuted));
  }, [isMuted]);

  // Persist current level ('currentLevel')
  useEffect(() => {
    localStorage.setItem('currentLevel', String(currentStep));
    localStorage.setItem('susana_current_level', String(currentStep));
  }, [currentStep]);

  // Persist completed levels
  useEffect(() => {
    localStorage.setItem('susana_completed_levels', JSON.stringify(completedSteps));
  }, [completedSteps]);

  // Companion dialogue & mood state
  const [ariSpeech, setAriSpeech] = useState(() => {
    if (!hasCompletedIntro) {
      return "¡Hola Susana hermosa! 🌸 Responde este cuestionario rápido para ver si eres la cumpleañera.";
    }
    if (currentStep === 3) return "¡Nooo, ya voy a llorar! 😭 Esa frase del capítulo 12 me destruye...";
    return "¡Feliz cumple Susana hermosa! 🌸 Afina tu viola leyendo la Clave de Do para iniciar el festejo.";
  });

  const [riversSpeech, setRiversSpeech] = useState(() => {
    if (!hasCompletedIntro) {
      return "¡Qué onda cumpleañera! 🥊 A ver si de verdad te sabes las respuestas clave jaja.";
    }
    if (currentStep === 3) return "¡Qué joya de serie, Susana! 🥺 Te las sabes toditas.";
    return "¡Esaaa, felicidades crack! 🥊 Dale con todo a ese arco de viola. ¡Demuestra que eres una pro!";
  });

  const [companionMood, setCompanionMood] = useState<CompanionMood>('idle');

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleSetCompanions = (ari: string, rivers: string, mood: CompanionMood = 'idle') => {
    setAriSpeech(ari);
    setRiversSpeech(rivers);
    setCompanionMood(mood);
    if (mood !== 'idle') {
      setTimeout(() => setCompanionMood('idle'), 3000);
    }
  };

  const handleCompleteStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const handleFinishIntro = () => {
    setHasCompletedIntro(true);
    try {
      sessionStorage.setItem('susana_intro_completed', 'true');
      localStorage.removeItem('susana_intro_completed');
    } catch (e) {}
    setCurrentStep(1);
    setCompletedSteps([]);
    try {
      localStorage.setItem('currentLevel', '1');
      localStorage.setItem('susana_current_level', '1');
      localStorage.setItem('susana_completed_levels', '[]');
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleSetCompanions(
      "¡Bienvenida a tu gran aventura Susana! 🌸 Comienza leyendo la Clave de Do en tu viola.",
      "¡A romperla con todo patrona! 🥊 ¡Disfruta el Nivel 1 de la viola!",
      'victory'
    );
  };

  const handleRestartIntro = () => {
    setHasCompletedIntro(false);
    try {
      sessionStorage.removeItem('susana_intro_completed');
      localStorage.removeItem('susana_intro_completed');
    } catch (e) {}
    setCurrentStep(1);
    setCompletedSteps([]);
    try {
      localStorage.setItem('currentLevel', '1');
      localStorage.setItem('susana_current_level', '1');
      localStorage.setItem('susana_completed_levels', '[]');
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleSetCompanions(
      "¡Hola Susana hermosa! 🌸 Responde este cuestionario rápido para ver si eres la cumpleañera.",
      "¡Qué onda cumpleañera! 🥊 A ver si de verdad te sabes las respuestas clave jaja.",
      'idle'
    );
  };

  const handleAdvanceToStep = (nextStep: GameStep) => {
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nextStep === 1) {
      handleSetCompanions(
        "¡Bienvenida de vuelta a las cuerdas de la viola!",
        "¡A romperla con ese arco mi reina! 🎻",
        'idle'
      );
    } else if (nextStep === 2) {
      handleSetCompanions(
        "¡Entramos al reproductor de Billie Eilish! 🟢 Adivina el riff acústico secreto en el cassette retro.",
        "¡Rola legendaria! A ver si le atinas al tema exacto crack 🎧",
        'idle'
      );
    } else if (nextStep === 3) {
      handleSetCompanions(
        "¡Nooo, ya voy a llorar! 😭 Esa frase del capítulo 12 me destruye...",
        "¡Qué joya de serie, Susana! 🥺 Te las sabes toditas.",
        'idle'
      );
    } else if (nextStep === 4) {
      handleSetCompanions(
        "¡Llegaste a nuestro lore Susana! 💕 A ver si te sabes los edits virales y nuestras bromas en stream.",
        "¡Aquí no hay spoilers mi reina, demuéstranos qué tan fan eres! 🥊",
        'idle'
      );
    } else if (nextStep === 5) {
      handleSetCompanions(
        "¡LO LOGRASTE SUSANA! 🎂💖 Superaste todos los retos. ¡Abre tu regalo que te lo mereces todo!",
        "¡Eso patrona! 👑🥊 ¡Desbloqueaste el regalo final! Prepárate para el confeti y las fotos.",
        'victory'
      );
    }
  };

  const handleResetQuest = () => {
    if (window.confirm("¿Deseas reiniciar la aventura desde el Nivel 1?")) {
      setCurrentStep(1);
      setCompletedSteps([]);
      try {
        localStorage.removeItem('currentLevel');
        localStorage.removeItem('susana_current_level');
        localStorage.removeItem('susana_completed_levels');
        sessionStorage.removeItem('susana_intro_completed');
        localStorage.removeItem('susana_intro_completed');
      } catch (e) {}
      audio.stopBirthdaySong();
      handleSetCompanions(
        "¡Nueva partida iniciada! 🌸 Lee la Clave de Do con atención, hermosa.",
        "¡Vamos de nuevo desde el principio! Dale con todo a esa viola 🎻",
        'idle'
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0D0E11] text-gray-100 flex justify-center relative">
      {/* GLOBAL FIXED SOUND TOGGLE BUTTON (ACCESSIBLE IN TOP CORNER AT ALL TIMES) */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <button
          onClick={handleToggleMute}
          className="p-2.5 rounded-2xl bg-[#161820]/90 border border-white/15 hover:border-billieLime/50 text-gray-300 hover:text-billieLime transition-all tap-btn shadow-lg backdrop-blur-md flex items-center gap-1.5"
          title={isMuted ? "Activar sonido" : "Silenciar sonido"}
          aria-label="Control de sonido"
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] font-bold text-rose-300 hidden sm:inline">Mute</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-billieLime animate-pulse" />
              <span className="text-[10px] font-bold text-billieLime hidden sm:inline">Audio</span>
            </>
          )}
        </button>
      </div>

      {/* Global Draggable Mascots Overlay (Ari & Rivers) */}
      <FloatingMascots
        currentStep={currentStep}
        ariText={ariSpeech}
        riversText={riversSpeech}
        mood={companionMood}
      />

      {/* Mobile container: max-w-md */}
      <div className="w-full max-w-md min-h-screen px-4 py-5 flex flex-col justify-between relative z-10 pb-24">
        <div>
          {!hasCompletedIntro ? (
            /* INTRODUCTORY WELCOME QUIZ: 4 PERSONAL QUESTIONS BEFORE THE QUEST */
            <div className="pt-2">
              <IntroWelcomeQuiz
                onComplete={handleFinishIntro}
                onSetCompanions={handleSetCompanions}
              />
            </div>
          ) : (
            /* MAIN QUEST: HEADER & 5 LEVELS */
            <div>
              {/* Header with 5-step progress stepper */}
              <Header
                currentStep={currentStep}
                completedSteps={completedSteps}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
                onSelectStep={handleAdvanceToStep}
                onRestartIntro={handleRestartIntro}
              />

              {/* Active Level Content with Smooth Transition */}
              <main key={currentStep} className="mt-2 mb-6 level-transition">
                {currentStep === 1 && (
                  <LevelViola
                    isCompleted={completedSteps.includes(1)}
                    onComplete={() => handleCompleteStep(1)}
                    onAdvance={() => handleAdvanceToStep(2)}
                    onSetCompanions={handleSetCompanions}
                  />
                )}

                {currentStep === 2 && (
                  <LevelBillie
                    isCompleted={completedSteps.includes(2)}
                    onComplete={() => handleCompleteStep(2)}
                    onAdvance={() => handleAdvanceToStep(3)}
                    onSetCompanions={handleSetCompanions}
                  />
                )}

                {currentStep === 3 && (
                  <LevelQueenOfTears
                    isCompleted={completedSteps.includes(3)}
                    onComplete={() => handleCompleteStep(3)}
                    onAdvance={() => handleAdvanceToStep(4)}
                    onSetCompanions={handleSetCompanions}
                  />
                )}

                {currentStep === 4 && (
                  <LevelAriRivers
                    isCompleted={completedSteps.includes(4)}
                    onComplete={() => handleCompleteStep(4)}
                    onAdvance={() => handleAdvanceToStep(5)}
                    onSetCompanions={handleSetCompanions}
                  />
                )}

                {currentStep === 5 && (
                  <LevelGift
                    onSetCompanions={handleSetCompanions}
                    onResetQuest={handleResetQuest}
                  />
                )}
              </main>
            </div>
          )}
        </div>

        {/* Global Footer */}
        <footer className="w-full pt-4 pb-3 border-t border-white/5 text-center flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-300 font-medium">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
            <span>especialmente para ti</span>
            <span className="text-billieLime">•</span>
            <span className="text-white font-bold">Susana</span>
            <span className="text-gray-500">| 13 de Octubre</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1">
              <Music2 className="w-3 h-3 text-stringC" /> Viola
            </span>
            <span>•</span>
            <span className="text-billieLime font-semibold">Billie</span>
            <span>•</span>
            <span className="text-purple-300 font-semibold">Reina de las Lágrimas</span>
            <span>•</span>
            <span className="text-pink-400 font-semibold">Ari & Rivers</span>
          </div>

          <div className="flex items-center gap-3 mt-1">
            {hasCompletedIntro && (
              <button
                onClick={handleRestartIntro}
                className="text-[10px] text-billieLime hover:underline flex items-center gap-1 transition-colors tap-btn"
                title="Repetir test de bienvenida"
              >
                <HelpCircle className="w-3 h-3" /> Repetir Test de Bienvenida
              </button>
            )}

            {completedSteps.length > 0 && (
              <button
                onClick={handleResetQuest}
                className="text-[10px] text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors tap-btn"
              >
                <RotateCcw className="w-3 h-3" /> Reiniciar Misión
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
