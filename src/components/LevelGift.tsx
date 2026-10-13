import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Gift,
  Lock,
  Unlock,
  Sparkles,
  Heart,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Check,
  RotateCcw,
  Copy,
  Maximize2
} from 'lucide-react';
import { audio } from '../utils/audio';
import { CompanionMood, MemoryPhoto } from '../types';
import { PhotoModal } from './PhotoModal';

interface LevelGiftProps {
  onSetCompanions: (ari: string, rivers: string, mood: CompanionMood) => void;
  onResetQuest: () => void;
}

const DEFAULT_LETTER = `Querida Susana,

Hoy es 13 de octubre, un día sumamente especial porque hoy es tu cumpleaños y celebramos la existencia de una persona única, talentosa e irrepetible.

Que todos los dias envies videos tocando viola y escuchar su sonido es algo que espero que jamas dejes de enviarme. Tu forma de ser, tu pasión, tu dedicación y tu elegancia son verdaderamente mágicos.

Desde tu amor por la viola y tu fanatismo por los gatitos hasta tus lágrimas y sonrisas viendo Reina de las Lágrimas, tus risas con el lore de Ari y Rivers, y el amor incondicional que le entregas a tus hermosos hijos gatunos (Vida y Tom)... Todo en ti te hace ser una persona maravillosa a la que es imposible no querer con todo el corazón.

Que este nuevo año de vida venga repleto de conciertos increíbles donde siempre que pueda espero poder estar, melodías hermosas, proyectos cumplidos, risas infinitas y felicidad completa. ¡Nunca dejes de tocar con el corazón ni de sonreír como tú sabes!

¡Feliz Cumpleaños, Susana! 🎻🎂✨`;

const PHOTOS: MemoryPhoto[] = [
  {
    id: 'photo-viola',
    title: 'Elegancia & Pasión',
    subtitle: 'La viola en concierto',
    src: './imagenes/susana-viola.jpg',
    description: 'Susana radiante con su viola, vestido de gala y una sonrisa que llena todo el escenario.',
    tag: '🎻 Maestra de Viola',
    color: '#38BDF8',
  },
  {
    id: 'photo-gato-blanco',
    title: 'Amor Felino',
    subtitle: 'Con su gatito blanco',
    src: './imagenes/susana-gato-blanco.png',
    description: 'Mirada tierna y ojitos verdes, cómplices en cada momento de cariño y ronroneos.',
    tag: '🐱 Tom',
    color: '#C6F135',
  },
  {
    id: 'photo-gato-negro',
    title: 'Dúo Dinámico',
    subtitle: 'Con su gatito negro',
    src: './imagenes/susana-gato-negro.png',
    description: 'La belleza de los ojos curiosos y un abrazo lleno de ternura incondicional.',
    tag: '🐈‍⬛ Vida',
    color: '#A855F7',
  },
  {
    id: 'photo-viaje-1',
    title: 'Risas Compartidas',
    subtitle: 'Aventura de viaje',
    src: './imagenes/susana-viaje-1.jpg',
    description: 'Sonrisas sinceras que quedan grabadas para siempre en el corazón.',
    tag: '💑 Juntos',
    color: '#F43F5E',
  },
  {
    id: 'photo-viaje-2',
    title: 'Complicidad Pura',
    subtitle: 'Un recuerdo especial',
    src: './imagenes/susana-viaje-2.jpg',
    description: 'El brillo de los ojos y la alegría de compartir la vida lado a lado.',
    tag: '💖 Momentos',
    color: '#FBBF24',
  },
];

export const LevelGift: React.FC<LevelGiftProps> = ({ onSetCompanions, onResetQuest }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isEditingLetter, setIsEditingLetter] = useState(false);
  const [letterText, setLetterText] = useState(() => {
    return localStorage.getItem('susana_birthday_letter') || DEFAULT_LETTER;
  });
  const [displayedText, setDisplayedText] = useState('');
  const [isTypewriterDone, setIsTypewriterDone] = useState(false);
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  // Trigger grand continuous pastel and neon confetti
  const triggerConfettiExplosion = () => {
    audio.playPop();

    const count = 280;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#C6F135', '#F472B6', '#C4B5FD', '#38BDF8', '#FBBF24', '#FFFFFF'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 1.1 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Open gift action
  const handleOpenGift = () => {
    setIsUnlocked(true);
    triggerConfettiExplosion();

    // Start acoustic birthday song
    setIsPlayingSong(true);
    audio.playBirthdaySong(() => {
      setIsPlayingSong(false);
    });

    onSetCompanions(
      "¡FELIZ CUMPLEAÑOS SUSANA! 🎂💖 Miren esa carta y esas fotos tan hermosas... ¡Te queremos con el alma entera!",
      "¡Eso mamona, qué belleza! 🥊✨ Te rifaste con la viola y con todo. ¡Felicidades hoy y siempre en tu día!",
      'victory'
    );
  };

  // Typewriter effect when unlocked
  useEffect(() => {
    if (!isUnlocked) return;
    let idx = 0;
    setIsTypewriterDone(false);
    setDisplayedText('');

    const interval = setInterval(() => {
      if (idx < letterText.length) {
        setDisplayedText(prev => prev + letterText.charAt(idx));
        idx++;
      } else {
        setIsTypewriterDone(true);
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [isUnlocked, letterText]);

  const handleSkipTypewriter = () => {
    setDisplayedText(letterText);
    setIsTypewriterDone(true);
  };

  const handleToggleBirthdaySong = () => {
    if (isPlayingSong) {
      audio.stopBirthdaySong();
      setIsPlayingSong(false);
    } else {
      setIsPlayingSong(true);
      audio.playBirthdaySong(() => {
        setIsPlayingSong(false);
      });
    }
  };

  const handleSaveLetter = () => {
    localStorage.setItem('susana_birthday_letter', letterText);
    setIsEditingLetter(false);
    setDisplayedText(letterText);
    setIsTypewriterDone(true);
  };

  const handleResetLetter = () => {
    setLetterText(DEFAULT_LETTER);
    localStorage.removeItem('susana_birthday_letter');
    setIsEditingLetter(false);
    setDisplayedText(DEFAULT_LETTER);
    setIsTypewriterDone(true);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(letterText).then(() => {
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2500);
    });
  };

  const activePhoto = PHOTOS[activePhotoIdx];

  return (
    <div className="w-full flex flex-col gap-4 animate-fadeIn pb-8">
      {/* Lightbox Modal */}
      <PhotoModal photo={selectedPhoto} onClose={() => setSelectedPhoto(null)} />

      {!isUnlocked ? (
        /* LOCKED STATE: Neon Lock Box */
        <div className="glass-panel-neon rounded-3xl p-6 border border-billieLime/40 text-center flex flex-col items-center gap-5 shadow-neon">
          <div className="relative my-2">
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-700 via-rose-600 to-billieLime p-1 animate-pulse-glow shadow-2xl">
              <div className="w-full h-full rounded-2xl bg-[#121318] flex items-center justify-center relative overflow-hidden">
                <Gift className="w-14 h-14 text-billieLime animate-bounce" />
                <div className="absolute top-2 right-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-black/80 border border-billieLime text-billieLime shadow-neon">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-billieLime">
              Nivel 5: La Gran Recompensa
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              ¡El Regalo de Cumpleaños de Susana!
            </h2>
            <p className="text-xs text-gray-300 max-w-xs mx-auto">
              Has superado la afinación de la viola, el laboratorio de Billie, Reina de las Lágrimas y el lore de Ari & Rivers.
            </p>
          </div>

          <button
            onClick={handleOpenGift}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-billieLime via-emerald-400 to-stringC text-black font-black text-base tracking-wide shadow-neonStrong hover:scale-[1.02] transition-all tap-btn flex items-center justify-center gap-2.5"
          >
            <Unlock className="w-5 h-5 stroke-[2.5]" />
            <span>ABRIR REGALO SORPRESA 🎁</span>
          </button>
        </div>
      ) : (
        /* UNLOCKED STATE: Grand Celebration */
        <div className="space-y-5 animate-fadeIn">
          {/* Header Banner */}
          <div className="glass-panel-neon rounded-3xl p-5 border border-billieLime/40 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-billieLime/15 text-billieLime border border-billieLime/30 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> 13 de Octubre • Cumpleaños de Susana
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              ¡FELIZ CUMPLEAÑOS, SUSANA! 🎂🎉
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-sm mx-auto">
              Que tu viola siga llenando de música hermosa cada instante y que este día esté colmado de todo el amor del mundo.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10">
              <button
                onClick={triggerConfettiExplosion}
                className="px-3.5 py-1.5 rounded-xl bg-billieLime/20 border border-billieLime/40 hover:bg-billieLime/30 text-billieLime text-xs font-bold transition-all tap-btn flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>¡Más Confetti! 🎉</span>
              </button>

              <button
                onClick={handleToggleBirthdaySong}
                className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all tap-btn flex items-center gap-1.5 ${isPlayingSong
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-white/10 border-white/20 text-gray-200 hover:text-white'
                  }`}
              >
                {isPlayingSong ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Pausar Canción 🎻</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Sonando Cumpleaños en Viola 🎶</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Photo Carousel */}
          <div className="glass-panel rounded-3xl p-5 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Carrusel de Recuerdos</span>
                  <Sparkles className="w-4 h-4 text-billieLime" />
                </h3>
                <p className="text-[11px] text-gray-400">
                  Desliza o usa las flechas para revivir cada momento
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-billieLime bg-black/40 px-2.5 py-1 rounded-full border border-billieLime/20">
                {activePhotoIdx + 1} / {PHOTOS.length}
              </span>
            </div>

            {/* Carousel Main Card */}
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black/60 border border-white/10 group shadow-lg">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Tag & Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-1 text-black font-mono"
                  style={{ backgroundColor: activePhoto.color }}
                >
                  {activePhoto.tag}
                </span>
                <h4 className="text-base font-bold text-white leading-tight">
                  {activePhoto.title}
                </h4>
                <p className="text-xs text-gray-300 mt-0.5">
                  {activePhoto.description}
                </p>
              </div>

              {/* Fullscreen button */}
              <button
                onClick={() => setSelectedPhoto(activePhoto)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:text-billieLime border border-white/10"
                title="Ampliar foto"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Prev / Next controls */}
              <button
                onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? PHOTOS.length - 1 : prev - 1))}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:text-billieLime border border-white/10 tap-btn"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => setActivePhotoIdx((prev) => (prev === PHOTOS.length - 1 ? 0 : prev + 1))}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:text-billieLime border border-white/10 tap-btn"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Carousel Dots */}
            <div className="flex items-center justify-center gap-2 pt-1">
              {PHOTOS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`h-2 rounded-full transition-all ${activePhotoIdx === idx ? 'w-6 bg-billieLime' : 'w-2 bg-white/20'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Letter Section (Typewriter Effect + Ari & Rivers Clapping Below) */}
          <div className="glass-panel rounded-3xl p-5 border border-white/15 relative">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Carta Personalizada para Susana
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLetter}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-billieLime text-xs flex items-center gap-1 tap-btn"
                >
                  {copiedLetter ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-billieLime" />
                      <span className="text-[10px] text-billieLime font-bold">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Copiar</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsEditingLetter(!isEditingLetter)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-billieLime text-xs flex items-center gap-1 tap-btn"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="text-[10px]">{isEditingLetter ? "Cancelar" : "Editar"}</span>
                </button>
              </div>
            </div>

            {isEditingLetter ? (
              <div className="space-y-3">
                <textarea
                  value={letterText}
                  onChange={(e) => setLetterText(e.target.value)}
                  className="w-full h-64 p-3 rounded-xl bg-black/60 border border-billieLime/40 text-xs sm:text-sm text-gray-100 font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-billieLime/50 resize-y"
                  placeholder="Escribe aquí tu dedicatoria especial..."
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleResetLetter}
                    className="text-xs text-gray-400 hover:text-rose-400 flex items-center gap-1 tap-btn"
                  >
                    <RotateCcw className="w-3 h-3" /> Restaurar original
                  </button>
                  <button
                    onClick={handleSaveLetter}
                    className="px-4 py-1.5 rounded-xl bg-billieLime text-black font-extrabold text-xs shadow-neon tap-btn flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Guardar
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 font-sans text-xs sm:text-sm leading-relaxed text-gray-200 whitespace-pre-line shadow-inner min-h-48">
                  {displayedText}
                  {!isTypewriterDone && (
                    <span className="inline-block w-2 h-4 bg-billieLime ml-1 animate-pulse" />
                  )}
                </div>

                {!isTypewriterDone && (
                  <button
                    onClick={handleSkipTypewriter}
                    className="mt-2 text-[10px] text-billieLime hover:underline font-bold"
                  >
                    Mostrar texto completo ⏩
                  </button>
                )}
              </div>
            )}

            {/* Ari & Rivers Clapping and Throwing Hearts Below */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center gap-4 text-center">
              <div className="flex items-center gap-1.5 text-xs text-pink-300 font-semibold animate-bounce">
                <span>👏 Ari aplaudiendo</span>
                <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
              </div>
              <span className="text-gray-500">•</span>
              <div className="flex items-center gap-1.5 text-xs text-rose-300 font-semibold animate-bounce">
                <span>Rivers celebrando 🥊</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
            </div>
          </div>

          {/* Repeat button & Dedication */}
          <div className="pt-2 text-center space-y-2">
            <button
              onClick={onResetQuest}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-semibold border border-white/10 tap-btn flex items-center justify-center gap-1.5 mx-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revivir toda la aventura desde el Nivel 1</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
