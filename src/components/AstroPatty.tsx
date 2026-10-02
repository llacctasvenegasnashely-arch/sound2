import React from 'react';
import { soundManager } from '../services/audioEngine';

export type AstroMood = 'happy' | 'listening' | 'cheering' | 'thinking' | 'encouraging' | 'doubt';

interface AstroPattyProps {
  mood?: AstroMood;
  speechText?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeech?: boolean;
  interactive?: boolean;
}

export const AstroPatty: React.FC<AstroPattyProps> = ({
  mood = 'happy',
  speechText,
  className = '',
  size = 'md',
  showSpeech = true,
  interactive = true,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16 sm:w-20 sm:h-20',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
  };

  const handleTapMascot = () => {
    if (!interactive) return;
    soundManager.playStarSound();
  };

  const isJumping = mood === 'cheering';
  const isListening = mood === 'listening';
  const isDoubt = mood === 'doubt' || mood === 'thinking';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Robot Astronaut Graphic */}
      <button
        type="button"
        onClick={handleTapMascot}
        className={`relative shrink-0 ${sizeClasses[size]} transition-transform duration-300 text-left focus:outline-none ${
          isJumping ? 'animate-bounce' : 'animate-float'
        } ${interactive ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}`}
        title="¡Soy Patty! Tu compañero espacial"
      >
        {/* Glow halo */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${
            isListening
              ? 'bg-amber-400/30 scale-125 animate-pulse'
              : isJumping
              ? 'bg-emerald-400/30 scale-125'
              : isDoubt
              ? 'bg-purple-400/20'
              : 'bg-cyan-400/20'
          }`}
        />

        <svg
          viewBox="0 0 120 120"
          className={`w-full h-full drop-shadow-xl relative z-10 transition-transform ${
            isDoubt ? 'rotate-[-4deg]' : ''
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Astronaut Antenna */}
          <path
            d="M60 22V8"
            stroke="#94A3B8"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="7"
            r="4.5"
            fill={isListening ? '#F59E0B' : isJumping ? '#10B981' : '#06B6D4'}
          />
          {isListening && (
            <circle
              cx="60"
              cy="7"
              r="9"
              stroke="#F59E0B"
              strokeWidth="2"
              opacity="0.7"
              className="animate-ping"
            />
          )}

          {/* Helmet Base */}
          <rect
            x="24"
            y="20"
            width="72"
            height="62"
            rx="31"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="3"
          />

          {/* Visor Screen */}
          <rect
            x="32"
            y="28"
            width="56"
            height="44"
            rx="20"
            fill="#0F172A"
            stroke={isListening ? '#F59E0B' : '#38BDF8'}
            strokeWidth="2.5"
          />

          {/* Visor Glare */}
          <path
            d="M40 34C44 31 52 31 56 31"
            stroke="#38BDF8"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Robot Eyes based on mood */}
          {isListening ? (
            // Closed eyes listening peacefully: ^ ^ curved serene closed eyes
            <>
              <path
                d="M44 49C47 44 51 44 54 49"
                stroke="#FBBF24"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M66 49C69 44 73 44 76 49"
                stroke="#FBBF24"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Sweet smile listening */}
              <path
                d="M52 57C56 60 64 60 68 57"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Zzz or musical notes floating */}
              <circle cx="78" cy="38" r="1.5" fill="#FBBF24" className="animate-ping" />
            </>
          ) : isJumping ? (
            // Joyful star eyes and big open happy smile
            <>
              <path
                d="M44 50C47 44 53 44 56 50"
                stroke="#34D399"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M64 50C67 44 73 44 76 50"
                stroke="#34D399"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M48 56C54 65 66 65 72 56"
                stroke="#FBBF24"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="#FBBF24"
              />
            </>
          ) : isDoubt ? (
            // Friendly kind doubt: One curious raised eye, small 'o' mouth
            <>
              {/* Left eye small curious */}
              <circle cx="48" cy="48" r="4.5" fill="#A855F7" />
              {/* Right eye raised with eyebrow */}
              <path d="M68 40C72 38 76 40 78 43" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="73" cy="48" r="5.5" fill="#A855F7" />
              {/* Small wondering 'o' mouth */}
              <circle cx="60" cy="58" r="3.5" stroke="#38BDF8" strokeWidth="2" />
            </>
          ) : (
            // Friendly open attentive eyes
            <>
              <circle cx="48" cy="48" r="4.5" fill="#38BDF8" />
              <circle cx="72" cy="48" r="4.5" fill="#38BDF8" />
              <circle cx="50" cy="46" r="1.5" fill="#FFFFFF" />
              <circle cx="74" cy="46" r="1.5" fill="#FFFFFF" />
              <path
                d="M52 57C56 61 64 61 68 57"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Headphones over helmet (glow bright when listening) */}
          <path
            d="M20 44C20 30 35 18 60 18C85 18 100 30 100 44"
            stroke={isListening ? '#F59E0B' : '#EC4899'}
            strokeWidth={isListening ? '5' : '4'}
            strokeLinecap="round"
          />
          {/* Left Earpad */}
          <rect
            x="15"
            y="40"
            width="12"
            height="26"
            rx="6"
            fill={isListening ? '#F59E0B' : '#F43F5E'}
            stroke={isListening ? '#D97706' : '#BE123C'}
            strokeWidth="1.5"
          />
          <circle cx="21" cy="53" r="2.5" fill="#FFFBEB" />

          {/* Right Earpad */}
          <rect
            x="93"
            y="40"
            width="12"
            height="26"
            rx="6"
            fill={isListening ? '#F59E0B' : '#F43F5E'}
            stroke={isListening ? '#D97706' : '#BE123C'}
            strokeWidth="1.5"
          />
          <circle cx="99" cy="53" r="2.5" fill="#FFFBEB" />

          {/* Astronaut Suit Neck / Collar */}
          <rect x="42" y="80" width="36" height="8" rx="4" fill="#38BDF8" />

          {/* Astronaut Suit Body */}
          <path
            d="M34 88C34 85 46 84 60 84C74 84 86 85 86 88L92 112C92 116 88 118 84 118H36C32 118 28 116 28 112L34 88Z"
            fill="#F1F5F9"
            stroke="#CBD5E1"
            strokeWidth="2.5"
          />

          {/* Chest Badge with Sound Wave */}
          <rect x="47" y="93" width="26" height="15" rx="4" fill="#0F172A" />
          <path
            d="M51 100V102M55 97V105M60 95V107M65 97V105M69 100V102"
            stroke={isListening ? '#F59E0B' : '#38BDF8'}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Hands */}
          {isJumping ? (
            // Hands raised up in celebratory victory!
            <>
              <circle cx="18" cy="72" r="6" fill="#38BDF8" />
              <circle cx="102" cy="72" r="6" fill="#38BDF8" />
            </>
          ) : (
            <>
              <circle cx="26" cy="100" r="5" fill="#38BDF8" />
              <circle cx="94" cy="100" r="5" fill="#38BDF8" />
            </>
          )}
        </svg>
      </button>

      {/* Comic Speech Bubble */}
      {showSpeech && speechText && (
        <div className="relative bg-slate-800/95 text-slate-100 border-2 border-cyan-400/40 rounded-2xl p-3 shadow-lg text-xs sm:text-sm max-w-xs sm:max-w-md">
          {/* Pointer */}
          <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-cyan-400/40 border-b-8 border-b-transparent" />
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-[7px] border-t-transparent border-r-[7px] border-r-slate-800 border-b-[7px] border-b-transparent" />
          <p className="font-semibold text-cyan-200 leading-snug">{speechText}</p>
        </div>
      )}
    </div>
  );
};
