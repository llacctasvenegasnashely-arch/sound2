/**
 * SoundPatty - Main Application
 * Fonoaudiología y Estimulación Cognitiva Infantil para Patrones Auditivos
 * Updated with Musical Instruments & Animals Sound Banks + Drag and Drop
 */

import React, { useState, useEffect } from 'react';
import { CategoryId, SoundThemeMode, UserProfile } from './types/game';
import { INITIAL_ACHIEVEMENTS } from './data/achievementsData';
import { HeaderNav } from './components/HeaderNav';
import { CategorySelection } from './components/CategorySelection';
import { GameScreen } from './components/GameScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { TherapyGuideModal } from './components/TherapyGuideModal';
import { SettingsModal } from './components/SettingsModal';
import { soundManager } from './services/audioEngine';

const STORAGE_KEY = 'soundpatty_profile_v4';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Astronauta',
  avatarId: 'astro1',
  currentThemeMode: 'instruments',
  totalStars: 90,
  unlockedLevels: {
    instruments: {
      frequency: 3,
      duration: 3,
      intensity: 3,
    },
    animals: {
      frequency: 3,
      duration: 3,
      intensity: 3,
    },
    voices: {
      frequency: 3,
      duration: 3,
      intensity: 3,
      prosody: 3,
    },
    notes: {
      frequency: 3,
      duration: 3,
      intensity: 3,
    },
  },
  starsPerCategory: {
    instruments: {
      frequency: 9,
      duration: 9,
      intensity: 9,
    },
    animals: {
      frequency: 9,
      duration: 9,
      intensity: 9,
    },
    voices: {
      frequency: 9,
      duration: 9,
      intensity: 9,
      prosody: 9,
    },
    notes: {
      frequency: 9,
      duration: 9,
      intensity: 9,
    },
  },
  completedChallengesCount: 30,
  firstTryWins: 24,
  totalPlays: 30,
  replaysCount: 6,
  dragDropSuccessCount: 30,
  unlockedAchievements: [
    'first_win',
    'perfect_ear',
    'frequency_master',
    'duration_master',
    'intensity_master',
    'star_collector',
    'galaxy_hero',
  ],
  playbackSpeed: 'normal',
  soundVolume: 0.8,
};

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          totalStars: Math.max(DEFAULT_PROFILE.totalStars, parsed.totalStars || 0),
          unlockedLevels: {
            instruments: {
              frequency: Math.max(3, parsed.unlockedLevels?.instruments?.frequency || 3),
              duration: Math.max(3, parsed.unlockedLevels?.instruments?.duration || 3),
              intensity: Math.max(3, parsed.unlockedLevels?.instruments?.intensity || 3),
            },
            animals: {
              frequency: Math.max(3, parsed.unlockedLevels?.animals?.frequency || 3),
              duration: Math.max(3, parsed.unlockedLevels?.animals?.duration || 3),
              intensity: Math.max(3, parsed.unlockedLevels?.animals?.intensity || 3),
            },
            voices: {
              frequency: Math.max(3, parsed.unlockedLevels?.voices?.frequency || 3),
              duration: Math.max(3, parsed.unlockedLevels?.voices?.duration || 3),
              intensity: Math.max(3, parsed.unlockedLevels?.voices?.intensity || 3),
              prosody: Math.max(3, parsed.unlockedLevels?.voices?.prosody || 3),
            },
            notes: {
              frequency: Math.max(3, parsed.unlockedLevels?.notes?.frequency || 3),
              duration: Math.max(3, parsed.unlockedLevels?.notes?.duration || 3),
              intensity: Math.max(3, parsed.unlockedLevels?.notes?.intensity || 3),
            },
          },
          starsPerCategory: {
            instruments: {
              frequency: Math.max(9, parsed.starsPerCategory?.instruments?.frequency || 9),
              duration: Math.max(9, parsed.starsPerCategory?.instruments?.duration || 9),
              intensity: Math.max(9, parsed.starsPerCategory?.instruments?.intensity || 9),
            },
            animals: {
              frequency: Math.max(9, parsed.starsPerCategory?.animals?.frequency || 9),
              duration: Math.max(9, parsed.starsPerCategory?.animals?.duration || 9),
              intensity: Math.max(9, parsed.starsPerCategory?.animals?.intensity || 9),
            },
            voices: {
              frequency: Math.max(9, parsed.starsPerCategory?.voices?.frequency || 9),
              duration: Math.max(9, parsed.starsPerCategory?.voices?.duration || 9),
              intensity: Math.max(9, parsed.starsPerCategory?.voices?.intensity || 9),
              prosody: Math.max(9, parsed.starsPerCategory?.voices?.prosody || 9),
            },
            notes: {
              frequency: Math.max(9, parsed.starsPerCategory?.notes?.frequency || 9),
              duration: Math.max(9, parsed.starsPerCategory?.notes?.duration || 9),
              intensity: Math.max(9, parsed.starsPerCategory?.notes?.intensity || 9),
            },
          },
          completedChallengesCount: Math.max(30, parsed.completedChallengesCount || 0),
          unlockedAchievements: Array.from(
            new Set([...(parsed.unlockedAchievements || []), ...DEFAULT_PROFILE.unlockedAchievements])
          ),
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_PROFILE;
  });

  const [currentScreen, setCurrentScreen] = useState<'home' | 'game' | 'achievements'>('home');
  const [currentThemeMode, setCurrentThemeMode] = useState<SoundThemeMode>(
    userProfile.currentThemeMode || 'instruments'
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('frequency');
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [isTherapyGuideOpen, setIsTherapyGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync volume with sound engine
  useEffect(() => {
    soundManager.setVolume(userProfile.soundVolume);
  }, [userProfile.soundVolume]);

  // Preload authentic animal audio samples
  useEffect(() => {
    soundManager.preloadAllAudio().catch(() => {});
  }, []);

  // Persist profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    } catch {
      // Ignore storage errors
    }
  }, [userProfile]);

  // Check achievements unlocks
  const checkAchievements = () => {
    setUserProfile((prev) => {
      const newlyUnlocked: string[] = [];

      INITIAL_ACHIEVEMENTS.forEach((ach) => {
        if (prev.unlockedAchievements.includes(ach.id)) return;

        let shouldUnlock = false;
        if (ach.id === 'first_win' && prev.completedChallengesCount >= 1) shouldUnlock = true;
        if (ach.id === 'perfect_ear' && prev.firstTryWins >= 1) shouldUnlock = true;
        if (
          ach.id === 'frequency_master' &&
          ((prev.starsPerCategory.instruments?.frequency ?? 0) >= 6 ||
            (prev.starsPerCategory.animals?.frequency ?? 0) >= 6 ||
            (prev.starsPerCategory.voices?.frequency ?? 0) >= 6 ||
            (prev.starsPerCategory.notes?.frequency ?? 0) >= 6 ||
            (prev.unlockedLevels.instruments?.frequency ?? 0) >= 2)
        )
          shouldUnlock = true;
        if (
          ach.id === 'duration_master' &&
          ((prev.starsPerCategory.instruments?.duration ?? 0) >= 6 ||
            (prev.starsPerCategory.animals?.duration ?? 0) >= 6 ||
            (prev.starsPerCategory.voices?.duration ?? 0) >= 6 ||
            (prev.starsPerCategory.notes?.duration ?? 0) >= 6 ||
            (prev.unlockedLevels.instruments?.duration ?? 0) >= 2)
        )
          shouldUnlock = true;
        if (
          ach.id === 'intensity_master' &&
          ((prev.starsPerCategory.instruments?.intensity ?? 0) >= 6 ||
            (prev.starsPerCategory.animals?.intensity ?? 0) >= 6 ||
            (prev.starsPerCategory.voices?.intensity ?? 0) >= 6 ||
            (prev.starsPerCategory.notes?.intensity ?? 0) >= 6 ||
            (prev.unlockedLevels.instruments?.intensity ?? 0) >= 2)
        )
          shouldUnlock = true;
        if (
          ach.id === 'prosody_master' &&
          (((prev.starsPerCategory.voices?.prosody ?? 0) >= 6) ||
            (prev.unlockedLevels.voices?.prosody ?? 0) >= 2)
        )
          shouldUnlock = true;
        if (ach.id === 'star_collector' && prev.totalStars >= 15) shouldUnlock = true;
        if (ach.id === 'attentive_ear' && prev.replaysCount >= 3) shouldUnlock = true;
        if (ach.id === 'galaxy_hero' && prev.completedChallengesCount >= 10) shouldUnlock = true;

        if (shouldUnlock) {
          newlyUnlocked.push(ach.id);
        }
      });

      if (newlyUnlocked.length > 0) {
        return {
          ...prev,
          unlockedAchievements: [...prev.unlockedAchievements, ...newlyUnlocked],
        };
      }
      return prev;
    });
  };

  const handleSelectMode = (mode: SoundThemeMode) => {
    setCurrentThemeMode(mode);
    setUserProfile((prev) => ({
      ...prev,
      currentThemeMode: mode,
    }));
  };

  const handleSelectCategory = (categoryId: CategoryId, level = 1) => {
    soundManager.playTap();
    setSelectedCategory(categoryId);
    setSelectedLevel(level);
    setCurrentScreen('game');
  };

  const handleResetProgress = () => {
    setUserProfile(DEFAULT_PROFILE);
    setCurrentThemeMode('instruments');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
    soundManager.playRetryChime();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 font-sans pb-12 sm:pb-8">
      {/* Background Cosmic Starfield Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-cyan-600/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-pink-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        {/* Top Bar Header */}
        <HeaderNav
          userProfile={userProfile}
          currentScreen={currentScreen}
          onNavigate={(screen) => {
            soundManager.playTap();
            setCurrentScreen(screen);
          }}
          onOpenTherapyGuide={() => setIsTherapyGuideOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Screen Content Router */}
        <main className="flex-1 pb-8">
          {currentScreen === 'home' && (
            <CategorySelection
              userProfile={userProfile}
              currentMode={currentThemeMode}
              onSelectMode={handleSelectMode}
              onSelectCategory={handleSelectCategory}
              onViewAchievements={() => {
                soundManager.playTap();
                setCurrentScreen('achievements');
              }}
            />
          )}

          {currentScreen === 'game' && (
            <GameScreen
              categoryId={selectedCategory}
              themeMode={currentThemeMode}
              initialLevel={selectedLevel}
              userProfile={userProfile}
              onUpdateProfile={setUserProfile}
              onBackToMenu={() => {
                soundManager.playTap();
                setCurrentScreen('home');
              }}
              onTriggerAchievementCheck={checkAchievements}
            />
          )}

          {currentScreen === 'achievements' && (
            <AchievementsScreen
              userProfile={userProfile}
              currentMode={currentThemeMode}
              onBackToHome={() => {
                soundManager.playTap();
                setCurrentScreen('home');
              }}
              onPlayCategory={(catId) => handleSelectCategory(catId, 1)}
            />
          )}
        </main>
      </div>

      {/* Speech Therapy Clinical Guide Modal */}
      <TherapyGuideModal
        isOpen={isTherapyGuideOpen}
        onClose={() => setIsTherapyGuideOpen(false)}
      />

      {/* Kid & Parent Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        userProfile={userProfile}
        onUpdateProfile={setUserProfile}
        onResetProgress={handleResetProgress}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Subtle Bottom Attribution Footer */}
      <footer className="relative z-10 border-t border-slate-900/80 px-4 py-3 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-400">SoundPatty</span>
          <span>·</span>
          <span>Instrumentos Musicales 🎹 & Animales 🦁</span>
          <span>·</span>
          <span>Fonoaudiología & Estimulación Cognitiva</span>
        </p>
      </footer>
    </div>
  );
}
