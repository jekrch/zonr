import { useState, useEffect, useCallback } from 'react';
import type { GameState, ScoreCategories, ScoreEntry } from '../types';
import { updateURL, loadGameStateFromURL, clearGameFromURL } from '../gameStateUtils';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    activePlayer: 0,
    currentScores: { roads: 0, cities: 0, monasteries: 0, fields: 0 },
    turn: 1
  });
  
  const [showSetup, setShowSetup] = useState<boolean>(true);

  // Load game state and theme from URL on mount
  useEffect(() => {
    const { gameState: loadedGameState, theme } = loadGameStateFromURL();
    
    if (loadedGameState) {
      setGameState(loadedGameState);
      setShowSetup(false);
      
      // URL theme always takes precedence - apply it immediately
      applyThemeFromURL(theme);
    } else {
      // No game in URL, use localStorage theme if available
      const localTheme = localStorage.getItem('znr-theme') || 'default';
      applyThemeFromURL(localTheme);
    }
  }, []);

  const applyThemeFromURL = (theme: string) => {
    // Remove all theme attributes first
    document.documentElement.removeAttribute('data-theme');
    
    // Apply theme (including 'default' which removes the attribute)
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Save to localStorage for future sessions
    localStorage.setItem('znr-theme', theme);
  };

  const createGame = useCallback((players: { name: string; color: string }[]): void => {
    const newGameState: GameState = {
      players: players.map((player, index) => ({
        id: index,
        name: player.name,
        color: player.color,
        totalScore: 0,
        history: []
      })),
      activePlayer: 0,
      currentScores: { roads: 0, cities: 0, monasteries: 0, fields: 0 },
      turn: 1
    };
    
    setGameState(newGameState);
    setShowSetup(false);
    updateURL(newGameState);
  }, []);

  const restartGame = useCallback((): void => {
    setGameState(prev => {
      const restartedGameState: GameState = {
        players: prev.players.map((player, index) => ({
          id: index,
          name: player.name,
          color: player.color, // Preserve the chosen color
          totalScore: 0,
          history: []
        })),
        activePlayer: 0,
        currentScores: { roads: 0, cities: 0, monasteries: 0, fields: 0 },
        turn: 1
      };
      
      updateURL(restartedGameState);
      return restartedGameState;
    });
  }, []);

  const startNewGame = useCallback((): void => {
    setGameState({
      players: [],
      activePlayer: 0,
      currentScores: { roads: 0, cities: 0, monasteries: 0, fields: 0 },
      turn: 1
    });
    setShowSetup(true);
    clearGameFromURL();
  }, []);

  // Memoize this function to prevent useHoldButton from resetting
  const updateCurrentScore = useCallback((category: keyof ScoreCategories, delta: number): void => {
    setGameState(prev => {
      const newValue = Math.max(0, prev.currentScores[category] + delta);
      const newScores = { ...prev.currentScores, [category]: newValue };
      return { ...prev, currentScores: newScores };
    });
  }, []);

  const getCurrentTotal = useCallback((): number => {
    return Object.values(gameState.currentScores).reduce((sum, score) => sum + score, 0);
  }, [gameState.currentScores]);

  const addScore = useCallback((): void => {
    const total = getCurrentTotal();
    
    setGameState(prev => {
      const newGameState = { ...prev };
      const activePlayerIndex = newGameState.activePlayer;
      
      newGameState.players[activePlayerIndex].totalScore += total;
      newGameState.players[activePlayerIndex].history.push({
        turn: newGameState.turn,
        scores: { ...newGameState.currentScores },
        total,
        id: `${Date.now()}-${Math.random()}`
      });

      newGameState.currentScores = { roads: 0, cities: 0, monasteries: 0, fields: 0 };
      newGameState.activePlayer = (newGameState.activePlayer + 1) % newGameState.players.length;
      
      if (newGameState.activePlayer === 0) {
        newGameState.turn += 1;
      }

      updateURL(newGameState);
      return newGameState;
    });
  }, [getCurrentTotal]);

  const selectPlayer = useCallback((playerIndex: number): void => {
    setGameState(prev => ({ ...prev, activePlayer: playerIndex }));
  }, []);

  const saveEditedScore = useCallback((
    entry: ScoreEntry | null, 
    newScores: ScoreCategories, 
    newTotal: number
  ): void => {
    if (!entry) return;

    setGameState(prev => {
      const newGameState = { ...prev };
      const activePlayerIndex = newGameState.activePlayer;
      const player = newGameState.players[activePlayerIndex];
      
      const entryIndex = player.history.findIndex(h => h.id === entry.id);
      if (entryIndex !== -1) {
        const oldTotal = player.history[entryIndex].total;
        player.history[entryIndex].scores = newScores;
        player.history[entryIndex].total = newTotal;
        
        player.totalScore = player.totalScore - oldTotal + newTotal;
      }

      updateURL(newGameState);
      return newGameState;
    });
  }, []);

  return {
    gameState,
    showSetup,
    setShowSetup,
    createGame,
    restartGame,
    startNewGame,
    updateCurrentScore,
    getCurrentTotal,
    addScore,
    selectPlayer,
    saveEditedScore
  };
};