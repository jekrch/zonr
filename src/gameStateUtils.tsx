import type { GameState, Player, ScoreEntry } from './types';

/**
 * Standard Carcassonne meeple colors
 */
export const PLAYER_COLORS = ['#5B9BD5', '#E85D75', '#70AD47', '#FFC000', '#4A4A4A', '#9966CC'];

/**
 * Get color index from hex value, returns -1 if not found
 */
const getColorIndex = (color: string): number => {
  return PLAYER_COLORS.indexOf(color);
};

/**
 * Get color hex value from index, falls back to default colors if invalid
 */
const getColorFromIndex = (index: number, fallbackIndex: number = 0): string => {
  return PLAYER_COLORS[index] || PLAYER_COLORS[fallbackIndex] || PLAYER_COLORS[0];
};

/**
 * Encodes a GameState object and theme into a compact URL-safe string
 * 
 * Format: {playerData}_{activePlayer}~{turn}~{theme}
 * Player format: {encodedName}#{colorIndex}-{turnScores}
 * Turn scores format: r{roads}c{cities}m{monasteries}f{fields}
 * 
 * @param gameState The current game state to encode
 * @param theme The current theme (optional, defaults to 'default')
 * @returns A compact URL-safe string representation
 */
export const encodeGameState = (gameState: GameState, theme: string = 'default'): string => {
  const playerStrings = gameState.players.map(player => {
    const colorIndex = getColorIndex(player.color);
    const historyStrings = player.history.map(entry => {
      let turnStr = '';
      if (entry.scores.roads > 0) turnStr += `r${entry.scores.roads}`;
      if (entry.scores.cities > 0) turnStr += `c${entry.scores.cities}`;
      if (entry.scores.monasteries > 0) turnStr += `m${entry.scores.monasteries}`;
      if (entry.scores.fields > 0) turnStr += `f${entry.scores.fields}`;
      return turnStr;
    });
    
    // Include color index in the encoding
    const colorPart = colorIndex >= 0 ? `#${colorIndex}` : '';
    return `${encodeURIComponent(player.name)}${colorPart}-${historyStrings.join('-')}`;
  });
  
  return `${playerStrings.join('_')}_${gameState.activePlayer}~${gameState.turn}~${theme}`;
};

/**
 * Decodes a URL-safe string back into a GameState object and theme
 * 
 * @param encoded The encoded string from encodeGameState
 * @returns Object with decoded GameState (or null) and theme
 */
export const decodeGameState = (encoded: string): { gameState: GameState | null; theme: string } => {
  try {
    // Handle both old format (without theme) and new format (with theme)
    const parts = encoded.split('~');
    let theme = 'default';
    let turnInfo: string;
    let playerSection: string;

    if (parts.length === 3) {
      // New format: {playerData}~{turn}~{theme}
      [playerSection, turnInfo, theme] = parts;
    } else if (parts.length === 2) {
      // Old format: {playerData}~{turn}
      [playerSection, turnInfo] = parts;
    } else {
      return { gameState: null, theme: 'default' };
    }

    if (!playerSection || !turnInfo) {
      return { gameState: null, theme };
    }
    
    const playerParts = playerSection.split('_');
    if (playerParts.length < 3) {
      return { gameState: null, theme };
    }
    
    const turn = parseInt(turnInfo);
    const activePlayer = parseInt(playerParts[playerParts.length - 1]);
    const actualPlayerParts = playerParts.slice(0, -1);
    
    const players: Player[] = actualPlayerParts.map((playerPart, index) => {
      // Check if the player part contains color information
      let encodedName: string;
      let colorIndex = index; // Default fallback to index-based color
      let scoreParts: string[];
      
      // Look for color indicator (#)
      const hashIndex = playerPart.indexOf('#');
      if (hashIndex !== -1) {
        // New format with color
        encodedName = playerPart.substring(0, hashIndex);
        const afterHash = playerPart.substring(hashIndex + 1);
        const dashIndex = afterHash.indexOf('-');
        
        if (dashIndex !== -1) {
          colorIndex = parseInt(afterHash.substring(0, dashIndex));
          scoreParts = afterHash.substring(dashIndex + 1).split('-').filter(part => part);
        } else {
          colorIndex = parseInt(afterHash);
          scoreParts = [];
        }
      } else {
        // Old format without color - split normally
        const parts = playerPart.split('-');
        encodedName = parts[0];
        scoreParts = parts.slice(1);
      }
      
      const name = decodeURIComponent(encodedName);
      const color = getColorFromIndex(colorIndex, index);
      
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
        color,
        totalScore,
        history
      };
    });
    
    const gameState: GameState = {
      players,
      activePlayer,
      currentScores: { roads: 0, cities: 0, monasteries: 0, fields: 0 },
      turn
    };

    return { gameState, theme };
  } catch (e) {
    console.error('Failed to decode game state:', e);
    return { gameState: null, theme: 'default' };
  }
};

/**
 * Updates the browser URL with the current game state and theme
 * 
 * @param gameState The game state to encode in the URL
 * @param theme The current theme to encode in the URL
 */
export const updateURL = (gameState: GameState, theme?: string): void => {
  // Get current theme from localStorage if not provided
  const currentTheme = theme || localStorage.getItem('znr-theme') || 'default';
  
  const encoded = encodeGameState(gameState, currentTheme);
  const url = new URL(window.location.href);
  url.searchParams.set('game', encoded);
  window.history.pushState({}, '', url.toString());
};

/**
 * Updates the URL with just the theme (keeping existing game state)
 * 
 * @param theme The theme to save in the URL
 */
export const updateThemeInURL = (theme: string): void => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameData = urlParams.get('game');
  
  if (gameData) {
    const { gameState } = decodeGameState(gameData);
    if (gameState) {
      updateURL(gameState, theme);
    }
  }
};

/**
 * Loads game state and theme from the current URL parameters
 * 
 * @returns Object with decoded GameState (or null) and theme
 */
export const loadGameStateFromURL = (): { gameState: GameState | null; theme: string } => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameData = urlParams.get('game');
  
  if (gameData) {
    return decodeGameState(gameData);
  }
  
  return { gameState: null, theme: 'default' };
};

/**
 * Clears the game data from the URL, keeping only the base URL
 */
export const clearGameFromURL = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('game');
  window.history.pushState({}, '', url.toString());
};