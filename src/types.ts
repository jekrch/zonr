// Game State Types
export interface ScoreCategories {
  roads: number;
  cities: number;
  monasteries: number;
  fields: number;
  other: number; 
}

export interface ScoreEntry {
  turn: number;
  scores: ScoreCategories;
  total: number;
  id: string;
}

// New types for turn building
export interface TurnEntry {
  id: string;
  category: keyof ScoreCategories | 'other';
  points: number;
  categoryName: string;
  categoryIcon: string;
}

export interface TurnState {
  entries: TurnEntry[];
  total: number;
}

export class Player {
  id: number;
  name: string;
  color: string;
  totalScore: number;
  history: ScoreEntry[];

  constructor(
    id: number,
    name: string,
    color: string,
    totalScore: number = 0,
    history: ScoreEntry[] = []
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.totalScore = totalScore;
    this.history = history;
  }

  /**
   * Returns the player's name, or a generic name if one isn't provided.
   */
  getPlayerName(): string {
    return this.name.length ? this.name : `Player ${this.id + 1}`;
  }

  /**
   * Creates a new Player instance from a plain object.
   */
  static fromPlain(obj: Player): Player {
    return new Player(obj.id, obj.name, obj.color, obj.totalScore, obj.history);
  }
  
  /**
   * Creates a new instance of the player, allowing for safe state updates.
   */
  clone(): Player {
    return new Player(this.id, this.name, this.color, this.totalScore, [...this.history]);
  }
}

export class GameState {
  players: Player[];
  activePlayer: number;
  currentScores: ScoreCategories;
  turn: number;
  // New properties for turn building
  currentPoints: number;
  selectedCategory: keyof ScoreCategories | 'other';
  turnState: TurnState;

  constructor(
    players: Player[],
    activePlayer: number,
    currentScores: ScoreCategories,
    turn: number,
    currentPoints: number = 0,
    selectedCategory: keyof ScoreCategories | 'other' = 'other',
    turnState: TurnState = { entries: [], total: 0 }
  ) {
    this.players = players;
    this.activePlayer = activePlayer;
    this.currentScores = currentScores;
    this.turn = turn;
    this.currentPoints = currentPoints;
    this.selectedCategory = selectedCategory;
    this.turnState = turnState;
  }

  getActivePlayer(): Player {
    return this.players?.[this.activePlayer];
  }
}

export interface ScoreCategory {
  key: keyof ScoreCategories | 'other';
  label: string;
  icon: string;
}

// Component Props Types
export interface MeepleProps {
  color: string;
  className?: string;
}

export interface GameSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (playerNames: string[]) => void;
}

export interface ScoreDotProps {
  player: Player;
  position: { x: number; y: number };
}

export interface EditScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (scores: ScoreCategories, total: number) => void;
  entry: ScoreEntry | null;
}