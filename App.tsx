
import React, { useState, useEffect } from 'react';
import { Subject, AppScreen, GameState, LevelConfig } from './types';
import { INITIAL_LEVELS, SUBJECTS } from './constants';
import { HomeScreen } from './components/screens/HomeScreen';
import { MapScreen } from './components/screens/MapScreen';
import { GameScreen } from './components/screens/GameScreen';
import { ResultScreen } from './components/screens/ResultScreen';

const STORAGE_KEY = 'nani_adventure_save_v1';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.HOME);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [currentLevelId, setCurrentLevelId] = useState<number | null>(null);
  
  // Load initial state from localStorage or fallback to default
  const [levelsState, setLevelsState] = useState<Record<Subject, LevelConfig[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load save data:", e);
    }
    
    // Deep copy helper to ensure clean state for each subject
    const getFreshLevels = () => INITIAL_LEVELS.map(l => ({...l}));

    return {
      [Subject.MATH]: getFreshLevels(),
      [Subject.CHINESE]: getFreshLevels(),
      [Subject.ENGLISH]: getFreshLevels(),
      [Subject.LIFE]: getFreshLevels(),
    };
  });

  // Save to localStorage whenever levelsState changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(levelsState));
    } catch (e) {
      console.error("Failed to save progress:", e);
    }
  }, [levelsState]);

  const [lastGameResult, setLastGameResult] = useState<{score: number; total: number} | null>(null);

  const handleSelectSubject = (subject: Subject) => {
    setCurrentSubject(subject);
    setScreen(AppScreen.MAP);
  };

  const handleSelectLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setScreen(AppScreen.GAME);
  };

  const handleFinishLevel = (score: number, total: number) => {
    setLastGameResult({ score, total });
    
    // Unlock next level logic
    if (currentSubject && currentLevelId) {
      const percentage = (score / total) * 100;
      let stars = 0;
      if (percentage === 100) stars = 3;
      else if (percentage >= 60) stars = 2;
      else stars = 1;

      if (stars > 0) {
        setLevelsState(prev => {
          const subjectLevels = [...prev[currentSubject]];
          // Update current level stars
          const levelIndex = subjectLevels.findIndex(l => l.id === currentLevelId);
          if (levelIndex !== -1) {
            // Only update stars if the new score is higher
            const currentStars = subjectLevels[levelIndex].stars;
            subjectLevels[levelIndex] = {
              ...subjectLevels[levelIndex],
              stars: Math.max(currentStars, stars)
            };
          }
          // Unlock next level
          const nextLevelIndex = levelIndex + 1;
          if (nextLevelIndex < subjectLevels.length) {
            // Check if already unlocked to avoid unnecessary updates (though harmless)
            if (subjectLevels[nextLevelIndex].isLocked) {
               subjectLevels[nextLevelIndex] = {
                 ...subjectLevels[nextLevelIndex],
                 isLocked: false
               };
            }
          }
          return {
            ...prev,
            [currentSubject]: subjectLevels
          };
        });
      }
    }

    setScreen(AppScreen.RESULT);
  };

  const getTopicName = () => {
    if (!currentSubject || !currentLevelId) return "";
    const subjectData = SUBJECTS.find(s => s.id === currentSubject);
    // Use index to find topic (Level 1 -> index 0)
    return subjectData?.topics[currentLevelId - 1] || "綜合練習";
  };

  return (
    <>
      {screen === AppScreen.HOME && (
        <HomeScreen onSelectSubject={handleSelectSubject} />
      )}

      {screen === AppScreen.MAP && currentSubject && (
        <MapScreen 
          subject={currentSubject}
          levels={levelsState[currentSubject]}
          onSelectLevel={handleSelectLevel}
          onBack={() => setScreen(AppScreen.HOME)}
        />
      )}

      {screen === AppScreen.GAME && currentSubject && currentLevelId && (
        <GameScreen
          subject={currentSubject}
          level={levelsState[currentSubject].find(l => l.id === currentLevelId)!}
          topicName={getTopicName()}
          onFinishLevel={handleFinishLevel}
          onExit={() => setScreen(AppScreen.MAP)}
        />
      )}

      {screen === AppScreen.RESULT && lastGameResult && (
        <ResultScreen
          score={lastGameResult.score}
          total={lastGameResult.total}
          onRestart={() => setScreen(AppScreen.GAME)}
          onBackToMap={() => setScreen(AppScreen.MAP)}
        />
      )}
    </>
  );
};

export default App;
