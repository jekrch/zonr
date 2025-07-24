import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, type ScoreCategories, type ScoreEntry, type TurnEntry } from '../types';
import { updateURL, loadGameStateFromURL, clearGameFromURL } from '../gameStateUtils';

const createGameStateInstance = (data: any): GameState => {
  const initialScores = { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 };
  if (!data || !data.players) {
    return new GameState([], 0, initialScores, 1);
  }
  
  const players = data.players.map((p: any) => Player.fromPlain(p));
  return new GameState(
    players, 
    data.activePlayer, 
    data.currentScores, 
    data.turn,
    data.currentPoints || 0,
    data.selectedCategory || 'other',
    data.turnState || { entries: [], total: 0 }
  );
};

// Category metadata for creating turn entries
const categoryMetadata = {
  roads: { name: 'Roads', icon: '🛤️' },
  cities: { name: 'Cities', icon: '🏰' },
  monasteries: { name: 'Monasteries', icon: '⛪' },
  fields: { name: 'Fields', icon: '🌾' },
  other: { name: 'Other', icon: '➕' }
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(
    () => createGameStateInstance(null)
  );
  
  const [showSetup, setShowSetup] = useState<boolean>(true);

  useEffect(() => {
    const { gameState: loadedGameState, theme } = loadGameStateFromURL();
    
    if (loadedGameState) {
      setGameState(createGameStateInstance(loadedGameState));
      setShowSetup(false);
      applyThemeFromURL(theme);
    } else {
      const localTheme = localStorage.getItem('znr-theme') || 'default';
      applyThemeFromURL(localTheme);
    }
  }, []);

  const applyThemeFromURL = (theme: string) => {
    document.documentElement.removeAttribute('data-theme');
    if (theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('znr-theme', theme);
  };

  const createGame = useCallback((players: { name: string; color: string }[]): void => {
    const gamePlayers = players.map(
      (player, index) => new Player(index, player.name, player.color)
    );

    const newGameState = new GameState(
      gamePlayers,
      0,
      { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 },
      1
    );

    setGameState(newGameState);
    setShowSetup(false);
    updateURL(newGameState);
  }, []);

  const restartGame = useCallback((): void => {
    setGameState(prev => {
      const restartedPlayers = prev.players.map(
        (player) => new Player(player.id, player.name, player.color)
      );
      
      const restartedGameState = new GameState(
        restartedPlayers,
        0,
        { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 },
        1
      );
      
      updateURL(restartedGameState);
      return restartedGameState;
    });
  }, []);

  const startNewGame = useCallback((): void => {
    setGameState(createGameStateInstance(null));
    setShowSetup(true);
    clearGameFromURL();
  }, []);

  // New turn building functions
  const updateCurrentPoints = useCallback((delta: number): void => {
    setGameState(prev => {
      const newPoints = prev.currentPoints + delta;
      return new GameState(
        prev.players, 
        prev.activePlayer, 
        prev.currentScores, 
        prev.turn,
        newPoints,
        prev.selectedCategory,
        prev.turnState
      );
    });
  }, []);

  const setCurrentPoints = useCallback((points: number): void => {
    setGameState(prev => new GameState(
      prev.players, 
      prev.activePlayer, 
      prev.currentScores, 
      prev.turn,
      points,
      prev.selectedCategory,
      prev.turnState
    ));
  }, []);

  const selectCategory = useCallback((category: keyof ScoreCategories | 'other'): void => {
    setGameState(prev => new GameState(
      prev.players, 
      prev.activePlayer, 
      prev.currentScores, 
      prev.turn,
      prev.currentPoints,
      category,
      prev.turnState
    ));
  }, []);

  const addToTurn = useCallback((): void => {
    setGameState(prev => {
      if (prev.currentPoints === 0) return prev;

      const metadata = categoryMetadata[prev.selectedCategory];
      const newEntry: TurnEntry = {
        id: `${Date.now()}-${Math.random()}`,
        category: prev.selectedCategory,
        points: prev.currentPoints,
        categoryName: metadata.name,
        categoryIcon: metadata.icon
      };

      const newEntries = [...prev.turnState.entries, newEntry];
      const newTotal = prev.turnState.total + prev.currentPoints;

      return new GameState(
        prev.players,
        prev.activePlayer,
        prev.currentScores,
        prev.turn,
        0, // Reset current points
        prev.selectedCategory,
        { entries: newEntries, total: newTotal }
      );
    });
  }, []);

  const removeFromTurn = useCallback((entryId: string): void => {
    setGameState(prev => {
      const entryToRemove = prev.turnState.entries.find(e => e.id === entryId);
      if (!entryToRemove) return prev;

      const newEntries = prev.turnState.entries.filter(e => e.id !== entryId);
      const newTotal = prev.turnState.total - entryToRemove.points;

      return new GameState(
        prev.players,
        prev.activePlayer,
        prev.currentScores,
        prev.turn,
        prev.currentPoints,
        prev.selectedCategory,
        { entries: newEntries, total: newTotal }
      );
    });
  }, []);

  const finishTurn = useCallback((): void => {
    setGameState(prev => {
      // First, check if there are current points that haven't been added to turn yet
      let finalTurnEntries = [...prev.turnState.entries];
      let finalTurnTotal = prev.turnState.total;
      
      // If there are current points, automatically add them to the turn
      if (prev.currentPoints !== 0) {
        const metadata = categoryMetadata[prev.selectedCategory];
        const autoEntry = {
          id: `${Date.now()}-${Math.random()}-auto`,
          category: prev.selectedCategory,
          points: prev.currentPoints,
          categoryName: metadata.name,
          categoryIcon: metadata.icon
        };
        finalTurnEntries = [...finalTurnEntries, autoEntry];
        finalTurnTotal += prev.currentPoints;
      }
      
      // Handle zero-point turns - create empty score entry if no turn entries
      let scores: ScoreCategories = { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 };
      let total = 0;

      if (finalTurnEntries.length > 0) {
        // Convert turn entries to score categories - now including "other"
        finalTurnEntries.forEach(entry => {
          if (entry.category === 'other') {
            scores.other += entry.points;
          } else {
            scores[entry.category] += entry.points;
          }
        });
        total = finalTurnTotal;
      }
      // If no entries, scores remain all zeros and total is 0 (zero-point turn)
      
      const newPlayers = prev.players.map(p => p.clone());
      const activePlayerRef = newPlayers[prev.activePlayer];

      activePlayerRef.totalScore += total;
      activePlayerRef.history.push({
        turn: prev.turn,
        scores,
        total,
        id: `${Date.now()}-${Math.random()}`
      });

      const newActivePlayer = (prev.activePlayer + 1) % newPlayers.length;
      const newTurn = newActivePlayer === 0 ? prev.turn + 1 : prev.turn;
      
      const newGameState = new GameState(
        newPlayers, 
        newActivePlayer, 
        { roads: 0, cities: 0, monasteries: 0, fields: 0, other: 0 }, 
        newTurn,
        0, // Reset current points
        'other', // Reset to default category
        { entries: [], total: 0 } // Reset turn state
      );
      
      updateURL(newGameState);
      return newGameState;
    });
  }, []);

  const selectPlayer = useCallback((playerIndex: number): void => {
    setGameState(prev => {
      return new GameState(
        prev.players, 
        playerIndex, 
        prev.currentScores, 
        prev.turn,
        prev.currentPoints,
        prev.selectedCategory,
        prev.turnState
      );
    });
  }, []);

  const saveEditedScore = useCallback((
    entry: ScoreEntry | null, 
    newScores: ScoreCategories, 
    newTotal: number
  ): void => {
    if (!entry) return;

    setGameState(prev => {
      const newPlayers = prev.players.map(p => p.clone());
      const player = newPlayers[prev.activePlayer];
      const entryIndex = player.history.findIndex(h => h.id === entry.id);

      if (entryIndex !== -1) {
        const oldTotal = player.history[entryIndex].total;
        player.history[entryIndex] = { ...player.history[entryIndex], scores: newScores, total: newTotal };
        player.totalScore = player.totalScore - oldTotal + newTotal;

        const newGameState = new GameState(
          newPlayers, 
          prev.activePlayer, 
          prev.currentScores, 
          prev.turn,
          prev.currentPoints,
          prev.selectedCategory,
          prev.turnState
        );
        updateURL(newGameState);
        return newGameState;
      }

      return prev;
    });
  }, []);

  return {
    gameState,
    showSetup,
    setShowSetup,
    createGame,
    restartGame,
    startNewGame,
    updateCurrentPoints,
    setCurrentPoints,
    selectCategory,
    addToTurn,
    removeFromTurn,
    finishTurn,
    selectPlayer,
    saveEditedScore
  };
};