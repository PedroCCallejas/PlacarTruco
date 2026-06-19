export type TrucoVariant = 'truco-paulista' | 'truco-espanhol';
export type MatchMode = 'single-device' | 'dual-device';
export type BestOf = 1 | 3 | 5;
export type TeamKey = 'teamA' | 'teamB';
export type MatchPhase = 'idle' | 'inProgress' | 'setOver' | 'matchOver';
export type MatchResultType = 'set' | 'match';
export type ScoreStyle = 'cards' | 'beans' | 'crystals';
export type HistoryEntryType =
  | 'start-match'
  | 'add-points'
  | 'new-set'
  | 'reset-match';
export type RealtimeProvider = 'firebase-firestore';
export type RealtimeSyncStatus = 'disabled' | 'ready' | 'connected';

export interface TeamScore {
  teamA: number;
  teamB: number;
}

export interface MatchConfig {
  variant: TrucoVariant;
  mode: MatchMode;
  targetScore: number;
  bestOf: BestOf;
  teamA: string;
  teamB: string;
}

export interface RealtimeConfig {
  provider: RealtimeProvider;
  roomId: string | null;
  syncStatus: RealtimeSyncStatus;
}

export interface MatchResult {
  type: MatchResultType;
  winner: TeamKey;
  winningTeamName: string;
  createdAt: string;
  score: TeamScore;
  sets: TeamScore;
  targetScore: number;
  bestOf: BestOf;
}

export interface MatchSnapshot extends MatchConfig {
  currentScore: TeamScore;
  sets: TeamScore;
  phase: MatchPhase;
  pendingResult: MatchResult | null;
  realtime: RealtimeConfig;
}

export interface HistoryEntry {
  id: string;
  type: HistoryEntryType;
  createdAt: string;
  title: string;
  description: string;
  undoable: boolean;
  team?: TeamKey;
  points?: number;
  before: MatchSnapshot | null;
  after: MatchSnapshot;
}

export interface MatchStoreState extends MatchSnapshot {
  history: HistoryEntry[];
  scoreStyle: ScoreStyle;
}

export interface MatchStoreActions {
  addPoints: (team: TeamKey, points: number) => void;
  clearLocalData: () => void;
  dismissPendingResult: () => void;
  resetCurrentSet: () => void;
  resetMatch: () => void;
  setScoreStyle: (scoreStyle: ScoreStyle) => void;
  startNewMatch: (config: MatchConfig) => void;
  undoLastAction: () => void;
}

export type MatchStore = MatchStoreState & MatchStoreActions;
