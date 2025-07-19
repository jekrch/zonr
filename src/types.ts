// Game State Types
export interface ScoreCategories {
  roads: number;
  cities: number;
  monasteries: number;
  fields: number;
}

export interface ScoreEntry {
  turn: number;
  scores: ScoreCategories;
  total: number;
  id: string;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  totalScore: number;
  history: ScoreEntry[];
}

export interface GameState {
  players: Player[];
  activePlayer: number;
  currentScores: ScoreCategories;
  turn: number;
}

export interface ScoreCategory {
  key: keyof ScoreCategories;
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