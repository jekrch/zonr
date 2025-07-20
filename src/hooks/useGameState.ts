import { useState, useEffect, useCallback } from 'react';
import { GameState, Player, type ScoreCategories, type ScoreEntry } from '../types';
import { updateURL, loadGameStateFromURL, clearGameFromURL } from '../gameStateUtils';

const createGameStateInstance = (data: any): GameState => {
  const initialScores = { roads: 0, cities: 0, monasteries: 0, fields: 0 };
  if (!data || !data.players) {
    return new GameState([], 0, initialScores, 1);
  }
  
  const players = data.players.map((p: any) => Player.fromPlain(p));
  return new GameState(players, data.activePlayer, data.currentScores, data.turn);
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
      { roads: 0, cities: 0, monasteries: 0, fields: 0 },
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
        { roads: 0, cities: 0, monasteries: 0, fields: 0 },
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

  const updateCurrentScore = useCallback((category: keyof ScoreCategories, delta: number): void => {
    setGameState(prev => {
      const newValue = Math.max(0, prev.currentScores[category] + delta);
      const newScores = { ...prev.currentScores, [category]: newValue };
      return new GameState(prev.players, prev.activePlayer, newScores, prev.turn);
    });
  }, []);

  const getCurrentTotal = useCallback((): number => {
    return Object.values(gameState.currentScores).reduce((sum, score) => sum + score, 0);
  }, [gameState.currentScores]);

  const addScore = useCallback((): void => {
    setGameState(prev => {
      const total = Object.values(prev.currentScores).reduce((sum, score) => sum + score, 0);
      
      const newPlayers = prev.players.map(p => p.clone());
      const activePlayerRef = newPlayers[prev.activePlayer];

      activePlayerRef.totalScore += total;
      activePlayerRef.history.push({
        turn: prev.turn,
        scores: { ...prev.currentScores },
        total,
        id: `${Date.now()}-${Math.random()}`
      });

      const newActivePlayer = (prev.activePlayer + 1) % newPlayers.length;
      const newTurn = newActivePlayer === 0 ? prev.turn + 1 : prev.turn;
      const newCurrentScores = { roads: 0, cities: 0, monasteries: 0, fields: 0 };
      
      const newGameState = new GameState(newPlayers, newActivePlayer, newCurrentScores, newTurn);
      
      updateURL(newGameState);
      return newGameState;
    });
  }, []);

  const selectPlayer = useCallback((playerIndex: number): void => {
    setGameState(prev => {
      return new GameState(prev.players, playerIndex, prev.currentScores, prev.turn);
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

        const newGameState = new GameState(newPlayers, prev.activePlayer, prev.currentScores, prev.turn);
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
    updateCurrentScore,
    getCurrentTotal,
    addScore,
    selectPlayer,
    saveEditedScore
  };
};