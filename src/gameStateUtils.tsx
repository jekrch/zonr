import type { GameState, Player, ScoreEntry } from './types';

/**
 * Player colors used for game state reconstruction
 */
export const PLAYER_COLORS = ['#5B9BD5', '#E85D75', '#70AD47', '#FFC000', '#4A4A4A', '#9966CC'];

/**
 * Encodes a GameState object into a compact URL-safe string
 * 
 * Format: {playerData}_{activePlayer}~{turn}
 * Player format: {encodedName}-{turnScores}
 * Turn scores format: r{roads}c{cities}m{monasteries}f{fields}
 * 
 * @param gameState The current game state to encode
 * @returns A compact URL-safe string representation
 */
export const encodeGameState = (gameState: GameState): string => {
  const playerStrings = gameState.players.map(player => {
    const historyStrings = player.history.map(entry => {
      let turnStr = '';
      if (entry.scores.roads > 0) turnStr += `r${entry.scores.roads}`;
      if (entry.scores.cities > 0) turnStr += `c${entry.scores.cities}`;
      if (entry.scores.monasteries > 0) turnStr += `m${entry.scores.monasteries}`;
      if (entry.scores.fields > 0) turnStr += `f${entry.scores.fields}`;
      return turnStr;
    });
    return `${encodeURIComponent(player.name)}-${historyStrings.join('-')}`;
  });
  
  return `${playerStrings.join('_')}_${gameState.activePlayer}~${gameState.turn}`;
};

/**
 * Decodes a URL-safe string back into a GameState object
 * 
 * @param encoded The encoded string from encodeGameState
 * @returns The decoded GameState or null if decoding fails
 */
export const decodeGameState = (encoded: string): GameState | null => {
  try {
    const [playerSection, turnInfo] = encoded.split('~');
    if (!playerSection || !turnInfo) return null;
    
    const parts = playerSection.split('_');
    if (parts.length < 3) return null;
    
    const turn = parseInt(turnInfo);
    const activePlayer = parseInt(parts[parts.length - 1]);
    const playerParts = parts.slice(0, -1);
    
    const players: Player[] = playerParts.map((playerPart, index) => {
      const [encodedName, ...scoreParts] = playerPart.split('-');
      const name = decodeURIComponent(encodedName);
      
      const history: ScoreEntry[] = scoreParts.map((scorePart, historyIndex) => {
        const scores = { roads: 0, cities: 0, monasteries: 0, fields: 0 };
        
        const matches = scorePart.match(/([rcmf])(\d+)/g) || [];
        matches.forEach(match => {
          const letter = match[0];
          const value = parseInt(match.slice(1));
          switch (letter) {
            case 'r': scores.roads = value; break;
            case 'c': scores.cities = value; break;
            case 'm': scores.monasteries = value; break;
            case 'f': scores.fields = value; break;
          }
        });
        
        const total = scores.roads + scores.cities + scores.monasteries + scores.fields;
        
        return {
          turn: historyIndex + 1,
          scores,
          total,
          id: `${Date.now()}-${Math.random()}-${historyIndex}`
        };
      });
      
      const totalScore = history.reduce((sum, entry) => sum + entry.total, 0);
      
      return {
        id: index,
        name,
        color: PLAYER_COLORS[index],
        totalScore,
        history
      };
    });
    
    return {
      players,
      activePlayer,
      currentScores: { roads: 0, cities: 0, monasteries: 0, fields: 0 },
      turn
    };
  } catch (e) {
    console.error('Failed to decode game state:', e);
    return null;
  }
};

/**
 * Updates the browser URL with the current game state
 * 
 * @param gameState The game state to encode in the URL
 */
export const updateURL = (gameState: GameState): void => {
  const encoded = encodeGameState(gameState);
  const url = new URL(window.location.href);
  url.searchParams.set('game', encoded);
  window.history.pushState({}, '', url.toString());
};

/**
 * Loads game state from the current URL parameters
 * 
 * @returns The decoded GameState or null if no valid game data found
 */
export const loadGameStateFromURL = (): GameState | null => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameData = urlParams.get('game');
  
  if (gameData) {
    return decodeGameState(gameData);
  }
  
  return null;
};