import React, { useState, useEffect } from 'react';
import { Disc3, CheckCircle2, RotateCcw, Music4, Play, Pause, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';
import { CompanionMood } from '../types';

interface LevelBillieProps {
  onComplete: () => void;
  isCompleted: boolean;
  onAdvance: () => void;
  onSetCompanions: (ari: string, rivers: string, mood: CompanionMood) => void;
}

interface VerseFragment {
  id: string;
  text: string;
  correctIndex: number;
}

const BIRDS_VERSES: VerseFragment[] = [
  { id: 'v1', text: "I want you to stay 'til I'm in the grave", correctIndex: 0 },
  { id: 'v2', text: "'Til I'm rotting away, dead and buried", correctIndex: 1 },
  { id: 'v3', text: "'Til I'm in the casket you carry", correctIndex: 2 },
  { id: 'v4', text: "If you go, I'm going too, 'cause it was always you", correctIndex: 3 },
];

export const LevelBillie: React.FC<LevelBillieProps> = ({
  onComplete,
  isCompleted,
  onAdvance,
  onSetCompanions,
}) => {
  // Subphases: 1 (Retro Cassette Audio Challenge) | 2 (Verse Cryptogram)
  const [subPhase, setSubPhase] = useState<1 | 2>(1);

  // Audio player state
  const [isPlayingSnippet, setIsPlayingSnippet] = useState(false);
  const [selectedSongOption, setSelectedSongOption] = useState<string | null>(null);
  const [songFeedback, setSongFeedback] = useState<{ isSuccess: boolean; text: string } | null>(null);

  // Waveform bars animation
  const [waveBars, setWaveBars] = useState<number[]>(Array(14).fill(25));

  useEffect(() => {
    let interval: number;
    if (isPlayingSnippet) {
      interval = window.setInterval(() => {
        setWaveBars(Array(14).fill(0).map(() => Math.floor(Math.random() * 80) + 20));
      }, 100);
    } else {
      setWaveBars([20, 35, 50, 65, 45, 30, 40, 60, 75, 50, 35, 25, 40, 30]);
    }
    return () => clearInterval(interval);
  }, [isPlayingSnippet]);

  // Verse ordering state
  const [availableVerses] = useState<VerseFragment[]>([
    BIRDS_VERSES[2],
    BIRDS_VERSES[0],
    BIRDS_VERSES[3],
    BIRDS_VERSES[1],
  ]);
  const [selectedVerses, setSelectedVerses] = useState<VerseFragment[]>([]);
  const [hasVerseError, setHasVerseError] = useState(false);

  // Play audio snippet
  const handlePlaySnippet = () => {
    if (isPlayingSnippet) return;
    setIsPlayingSnippet(true);
    audio.playBillieSnippet('birds');

    onSetCompanions(
      "¡Qué melodía tan hermosa! Escucha cada acorde de Billie... 🟢",
      "¡Rola legendaria! A ver si le atinas al tema exacto crack 🎧",
      'idle'
    );

    setTimeout(() => {
      setIsPlayingSnippet(false);
    }, 2800);
  };

  // Song choice handler
  const handleSongSelect = (choice: 'birds' | 'ocean' | 'whatwas') => {
    setSelectedSongOption(choice);

    if (choice === 'birds') {
      audio.playSuccess();
      setSongFeedback({
        isSuccess: true,
        text: '¡Exacto! Es "Birds of a Feather", del álbum HIT ME HARD AND SOFT 🟢',
      });
      onSetCompanions(
        "¡Esa es mi Susana! 💚 Te sabes la música de Billie de memoria.",
        "¡A la primera crack! Ahora el criptograma de versos 🎧",
        'victory'
      );
      setTimeout(() => {
        setSubPhase(2);
      }, 1400);
    } else {
      audio.playDissonantError();
      setSongFeedback({
        isSuccess: false,
        text: 'Ese tema también es hermoso, pero no coincide con la melodía. ¡Escucha de nuevo!',
      });
      onSetCompanions(
        "¡Casi casi hermosa! Vuelve a reproducir el cassette 🌸",
        "¡Aguanta el beat! Échate otra escucha y elige la correcta 🥊",
        'error'
      );
    }
  };

  // Handle verse tap
  const handleVerseTap = (verse: VerseFragment) => {
    if (selectedVerses.some(v => v.id === verse.id)) return;

    const expectedIdx = selectedVerses.length;
    if (verse.correctIndex === expectedIdx) {
      const nextSelected = [...selectedVerses, verse];
      setSelectedVerses(nextSelected);
      audio.playTone(440 + expectedIdx * 110, 0.25, 'triangle', 0.2);

      if (nextSelected.length === BIRDS_VERSES.length) {
        audio.playSuccess();
        audio.playBillieSnippet('birds');
        onComplete();
        onSetCompanions(
          "¡Poesía pura de Billie! Te sabes Birds of a Feather completa Susana 💚✨",
          "¡No manches qué crack! ¡Desbloqueaste el siguiente nivel cinematográfico!",
          'victory'
        );
      } else {
        onSetCompanions(
          "¡Métrica y verso exactos! Sigue la canción en tu mente...",
          "¡Bien rimado! ¿Cuál sigue?",
          'idle'
        );
      }
    } else {
      audio.playDissonantError();
      setHasVerseError(true);
      setSelectedVerses([]);
      onSetCompanions(
        "¡Ese verso va después hermosa! Conéctate con la melodía...",
        "¡Aguanta el ritmo! Ese no era el orden de la estrofa, dale otra vez 🥊",
        'error'
      );
      setTimeout(() => setHasVerseError(false), 600);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn">
      {/* Level Header Banner */}
      <div className="glass-panel-neon rounded-2xl p-4 border border-billieLime/30 relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-billieLime uppercase tracking-wider flex items-center gap-1.5">
            <Music4 className="w-3.5 h-3.5" /> Nivel 2 • Dark Neon Sound
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-billieLime/10 text-billieLime border border-billieLime/20">
            {subPhase === 1 ? 'Fase 2.1: Cassette Retro' : 'Fase 2.2: Criptograma'}
          </span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-white">
          El Laboratorio Sonoro de Billie 🟢
        </h2>
        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
          {subPhase === 1
            ? 'Escucha el fragmento acústico en el reproductor de cassette y descubre qué canción icónica está sonando.'
            : 'Criptograma de versos: Ordena de memoria la estrofa poética de Birds of a Feather sin pistas visuales.'}
        </p>
      </div>

      {/* PHASE 2.1: Retro Billie Cassette Player */}
      {subPhase === 1 ? (
        <div className="glass-panel rounded-2xl p-4 border border-white/10 relative">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Disc3 className={`w-5 h-5 text-billieLime ${isPlayingSnippet ? 'animate-spin' : ''}`} />
              <span className="text-xs font-mono font-bold text-white tracking-widest uppercase">
                BILLIE EILISH // ACOUSTIC TAPE
              </span>
            </div>
            <span className="text-[10px] font-mono text-billieLime bg-black/60 px-2 py-0.5 rounded border border-billieLime/20">
              {isPlayingSnippet ? "PLAYING 00:24" : "PAUSED 00:00"}
            </span>
          </div>

          {/* Cassette Waveform Area */}
          <div className="w-full bg-[#0a0b0d] rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center gap-3">
            <div className="w-full h-16 flex items-end justify-center gap-1.5 px-2">
              {waveBars.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all duration-100"
                  style={{
                    height: `${h}%`,
                    backgroundColor: '#C6F135',
                    boxShadow: isPlayingSnippet ? '0 0 10px rgba(198, 241, 53, 0.7)' : 'none',
                    opacity: isPlayingSnippet ? 0.95 : 0.35,
                  }}
                />
              ))}
            </div>

            <button
              onClick={handlePlaySnippet}
              disabled={isPlayingSnippet}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-billieLime text-black font-extrabold text-xs tracking-wider shadow-neon hover:bg-[#b5dc2f] transition-all tap-btn"
            >
              {isPlayingSnippet ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-black" />
                  <span>SONANDO MELODÍA...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>REPRODUCIR MELODÍA ACÚSTICA 🎵</span>
                </>
              )}
            </button>
          </div>

          {/* Question and Options */}
          <div className="mt-4 space-y-2.5">
            <h3 className="text-xs sm:text-sm font-bold text-white">
              ¿Qué canción emblemática de Billie está sonando en el reproductor?
            </h3>

            {songFeedback && (
              <div
                className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  songFeedback.isSuccess
                    ? 'bg-billieLime/15 text-billieLime border border-billieLime/30'
                    : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                }`}
              >
                {songFeedback.isSuccess ? '✓ ' : '✕ '} {songFeedback.text}
              </div>
            )}

            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'birds', label: 'Birds of a Feather 🪶' },
                { id: 'ocean', label: 'Ocean Eyes 🌊' },
                { id: 'whatwas', label: 'What Was I Made For? ✨' },
              ].map((opt) => {
                const isSelected = selectedSongOption === opt.id;
                const isCorrect = isSelected && songFeedback?.isSuccess;
                const isWrong = isSelected && songFeedback && !songFeedback.isSuccess;

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSongSelect(opt.id as any)}
                    className={`w-full p-3 rounded-xl text-left text-xs sm:text-sm font-bold flex items-center justify-between border transition-all tap-btn ${
                      isCorrect
                        ? 'bg-billieLime text-black border-billieLime shadow-neon'
                        : isWrong
                        ? 'bg-rose-900/40 text-rose-200 border-rose-500/40'
                        : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-billieLime/40'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* PHASE 2.2: Cryptogram of Verses (Birds of a Feather) */
        <div className="glass-panel rounded-2xl p-4 border border-white/10 relative">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Disc3 className="w-4 h-4 text-billieLime" />
              <span>Criptograma de Versos (Birds of a Feather)</span>
            </span>
            {selectedVerses.length > 0 && selectedVerses.length < BIRDS_VERSES.length && (
              <button
                onClick={() => setSelectedVerses([])}
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 tap-btn"
              >
                <RotateCcw className="w-3 h-3" /> Reiniciar
              </button>
            )}
          </div>

          <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
            Pulsa los fragmentos en el orden poético exacto según la letra original de la canción:
          </p>

          <div
            className={`min-h-24 p-3 rounded-xl bg-[#0B0C0E] border mb-4 space-y-1.5 transition-colors ${
              hasVerseError
                ? 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                : 'border-white/10'
            }`}
          >
            {selectedVerses.length === 0 ? (
              <span className="text-[11px] text-gray-500 italic block py-4 text-center">
                (Selecciona el primer verso de la estrofa...)
              </span>
            ) : (
              selectedVerses.map((sv) => (
                <div
                  key={sv.id}
                  className="p-2 rounded-lg bg-billieLime/15 border border-billieLime/30 text-billieLime text-xs font-semibold flex items-center gap-2 animate-fadeIn"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-billieLime" />
                  <span>"{sv.text}"</span>
                </div>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 gap-2">
            {availableVerses.map((verse) => {
              const isAlreadySelected = selectedVerses.some(v => v.id === verse.id);
              const isAllDone = selectedVerses.length === BIRDS_VERSES.length;
              return (
                <button
                  key={verse.id}
                  onClick={() => handleVerseTap(verse)}
                  disabled={isAlreadySelected || isAllDone}
                  className={`w-full p-3 rounded-xl text-left text-xs font-medium border transition-all tap-btn ${
                    isAlreadySelected
                      ? 'bg-neutral-900/60 text-gray-600 border-white/5 opacity-40 cursor-default'
                      : 'bg-cardGlass hover:bg-white/10 text-gray-200 border-white/10 hover:border-billieLime/40'
                  }`}
                >
                  "{verse.text}"
                </button>
              );
            })}
          </div>

          {selectedVerses.length === BIRDS_VERSES.length && (
            <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2 animate-fadeIn">
              <div className="flex items-center justify-center gap-2 text-billieLime text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Laboratorio de Billie Superado!</span>
              </div>
              <button
                onClick={onAdvance}
                className="w-full py-3.5 px-4 rounded-xl bg-billieLime hover:bg-[#b0d82d] text-black font-extrabold text-sm tracking-wide transition-all shadow-neonStrong tap-btn flex items-center justify-center gap-2"
              >
                <span>SIGUIENTE: REINA DE LAS LÁGRIMAS ➜</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
