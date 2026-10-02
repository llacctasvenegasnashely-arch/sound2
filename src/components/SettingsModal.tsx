import React, { useState } from 'react';
import { X, Volume2, User, Gauge, RotateCcw, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types/game';
import { soundManager } from '../services/audioEngine';

interface SettingsModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

const AVATARS = [
  { id: 'astro1', label: 'Patty Astronauta', emoji: '🧑‍🚀' },
  { id: 'alien1', label: 'Amigo Cósmico', emoji: '👾' },
  { id: 'star1', label: 'Cadete Estelar', emoji: '⭐' },
  { id: 'robot1', label: 'Bot Sónico', emoji: '🤖' },
  { id: 'rocket1', label: 'Explorador Cohete', emoji: '🚀' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  userProfile,
  onUpdateProfile,
  onResetProgress,
  onClose,
}) => {
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatarId);
  const [volume, setVolume] = useState(userProfile.soundVolume);
  const [speed, setSpeed] = useState<'normal' | 'lento'>(userProfile.playbackSpeed);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundManager.setVolume(volume);
    onUpdateProfile((prev) => ({
      ...prev,
      name: nameInput.trim() || 'Astronauta',
      avatarId: selectedAvatar,
      soundVolume: volume,
      playbackSpeed: speed,
    }));
    soundManager.playStarSound();
    onClose();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
    soundManager.playTap();
  };

  const handleSpeedChange = (newSpeed: 'normal' | 'lento') => {
    setSpeed(newSpeed);
    soundManager.playTap();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Ajustes de Misión
              </h3>
              <p className="text-xs text-slate-400">
                Personaliza tu experiencia de juego
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors min-h-[36px]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Kid Name Input */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Nombre del Astronauta:</span>
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={20}
              placeholder="Escribe tu nombre..."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-800 border-2 border-slate-700 focus:border-cyan-400 text-white font-bold outline-none transition-colors"
            />
          </div>

          {/* Avatar Selector */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Elige tu Insignia:</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-2xl border-2 transition-all min-h-[50px] ${
                    selectedAvatar === av.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-white scale-105 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <span className="text-2xl">{av.emoji}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Speed Toggle (Speech Therapy friendly) */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Intervalo de Pausa entre Sonidos:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSpeedChange('normal')}
                className={`py-2 px-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] transition-all ${
                  speed === 'normal'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span>Pausa Normal (1.25s)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('lento')}
                className={`py-2 px-3 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 min-h-[44px] transition-all ${
                  speed === 'lento'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <span>Pausa Amplia (1.5s)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              * Cada sonido dura 5.0 segundos a 48 kHz para permitir una escucha atenta y detallada.
            </p>
          </div>

          {/* Sound Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-pink-400" />
                <span>Volumen de Sonido:</span>
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Reset Progress Section */}
          <div className="pt-2 border-t border-slate-800">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar progreso de estrellas y niveles</span>
              </button>
            ) : (
              <div className="bg-rose-950/40 border border-rose-500/40 rounded-2xl p-3 space-y-2">
                <p className="text-xs text-rose-300 font-semibold">
                  ¿Estás seguro de reiniciar todas las estrellas y logros?
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs"
                  >
                    Sí, reiniciar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all min-h-[48px] active:scale-95 shadow-md shadow-cyan-500/20"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Guardar y Cerrar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
