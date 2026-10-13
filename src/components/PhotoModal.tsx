import React from 'react';
import { X, Heart, Sparkles } from 'lucide-react';
import { MemoryPhoto } from '../types';

interface PhotoModalProps {
  photo: MemoryPhoto | null;
  onClose: () => void;
}

export const PhotoModal: React.FC<PhotoModalProps> = ({ photo, onClose }) => {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full bg-[#16181E] border border-white/15 rounded-2xl overflow-hidden shadow-2xl p-3 flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:text-billieLime hover:bg-black/80 transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Container */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-xl overflow-hidden bg-black/50 border border-white/10">
          <img
            src={photo.src}
            alt={photo.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-billieLime border border-billieLime/30 backdrop-blur-sm">
            {photo.tag}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1 px-1">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <span>{photo.title}</span>
              <Sparkles className="w-4 h-4 text-billieLime" />
            </h3>
            <span className="text-[11px] font-semibold text-gray-400">
              {photo.subtitle}
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            {photo.description}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-gray-400">
          <span className="flex items-center gap-1 text-pink-400 font-semibold">
            <Heart className="w-3.5 h-3.5 fill-pink-400" /> Momento Inolvidable
          </span>
          <button
            onClick={onClose}
            className="text-billieLime hover:underline font-bold text-xs"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
