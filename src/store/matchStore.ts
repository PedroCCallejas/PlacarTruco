import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_MATCH_CONFIG, getSetsToWin } from '@/constants/trucoRules';
import type {
  BestOf,
  HistoryEntry,
  HistoryEntryType,
  MatchConfig,
  MatchMode,
  MatchPhase,
  MatchResult,
  MatchStore,
  MatchStoreState,
  MatchSnapshot,
  RealtimeConfig,
  ScoreStyle,
  TeamKey,
  TeamScore,
  TrucoVariant,
} from '@/types/match';

const STORAGE_KEY = 'placar-truco.match-store';
const HISTORY_LIMIT = 80;
const DEFAULT_SCORE_STYLE: ScoreStyle = 'cards';

const createScore = (): TeamScore => ({
  teamA: 0,
  teamB: 0,
});

const cloneScore = (score: TeamScore): TeamScore => ({
  teamA: score.teamA,
  teamB: score.teamB,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const createRealtimeConfig = (): RealtimeConfig => ({
  provider: 'firebase-firestore',
  roomId: null,
  syncStatus: 'disabled',
});

const initialSnapshot: MatchSnapshot = {
  ...DEFAULT_MATCH_CONFIG,
  currentScore: createScore(),
  sets: createScore(),
  phase: 'idle',
  pendingResult: null,
  realtime: createRealtimeConfig(),
};

const createId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const createPlacementSeed = (): number => Math.floor(Math.random() * 1_000_000);

const normalizeTeamName = (value: unknown, fallback: string): string => {
  const trimmed = normalizeText(value);
  return trimmed.length > 0 ? trimmed : fallback;
};

const normalizeTargetScore = (targetScore: unknown): number => {
  const numericValue =
    typeof targetScore === 'number'
      ? targetScore
      : Number.parseInt(typeof targetScore === 'string' ? targetScore : '', 10);

  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
    return DEFAULT_MATCH_CONFIG.targetScore;
  }

  return Math.min(30, Math.max(1, Math.round(numericValue)));
};

const normalizeScoreValue = (value: unknown, max = 99): number => {
  const numericValue =
    typeof value === 'number'
      ? value
      : Number.parseInt(typeof value === 'string' ? value : '', 10);

  if (Number.isNaN(numericValue) || !Number.isFinite(numericValue)) {
    return 0;
  }

  return Math.min(max, Math.max(0, Math.round(numericValue)));
};

const normalizeVariant = (value: unknown): TrucoVariant => {
  switch (normalizeText(value)) {
    case 'truco-brasileiro':
    case 'truco-brasil':
    case 'truco-paulista':
      return 'truco-paulista';
    case 'truco-espanhol':
    case 'truco-espanol':
      return 'truco-espanhol';
    default:
      return DEFAULT_MATCH_CONFIG.variant;
  }
};

const normalizeScoreStyle = (value: unknown): ScoreStyle => {
  switch (normalizeText(value)) {
    case 'cards':
    case 'card':
      return 'cards';
    case 'beans':
    case 'bean':
    case 'feijao':
    case 'feijoes':
      return 'beans';
    case 'crystals':
    case 'crystal':
    case 'cristal':
    case 'cristais':
      return 'crystals';
    default:
      return DEFAULT_SCORE_STYLE;
  }
};

const normalizeMode = (value: unknown): MatchMode => {
  switch (normalizeText(value)) {
    case 'single-device':
    case 'same-device':
    case 'single':
    case 'local':
    case 'solo':
      return 'single-device';
    case 'dual-device':
    case 'dual':
    case 'online':
    default:
      return DEFAULT_MATCH_CONFIG.mode;
  }
};

const normalizeBestOf = (value: unknown): BestOf => {
  const numericValue =
    typeof value === 'number'
      ? value
      : Number.parseInt(typeof value === 'string' ? value : '', 10);

  if (numericValue === 1 || numericValue === 3 || numericValue === 5) {
    return numericValue;
  }

  return DEFAULT_MATCH_CONFIG.bestOf;
};

const normalizeTeamScore = (value: unknown): TeamScore => {
  if (!isRecord(value)) {
    return createScore();
  }

  return {
    teamA: normalizeScoreValue(value.teamA),
    teamB: normalizeScoreValue(value.teamB),
  };
};

const snapshotFromState = (state: MatchStoreState): MatchSnapshot => ({
  variant: state.variant,
  mode: state.mode,
  targetScore: state.targetScore,
  bestOf: state.bestOf,
  teamA: state.teamA,
  teamB: state.teamB,
  currentScore: cloneScore(state.currentScore),
  sets: cloneScore(state.sets),
  phase: state.phase,
  pendingResult: state.pendingResult
    ? {
        ...state.pendingResult,
        score: cloneScore(state.pendingResult.score),
        sets: cloneScore(state.pendingResult.sets),
      }
    : null,
  realtime: { ...state.realtime },
});

const teamNameForKey = (state: Pick<MatchStoreState, 'teamA' | 'teamB'>, team: TeamKey): string =>
  team === 'teamA' ? state.teamA : state.teamB;

const appendHistory = (history: HistoryEntry[], entry: HistoryEntry): HistoryEntry[] => {
  const next = [...history, entry];
  return next.slice(Math.max(0, next.length - HISTORY_LIMIT));
};

const createHistoryEntry = (params: {
  type: HistoryEntry['type'];
  title: string;
  description: string;
  before: MatchSnapshot | null;
  after: MatchSnapshot;
  undoable: boolean;
  team?: TeamKey;
  points?: number;
}): HistoryEntry => ({
  id: createId(),
  createdAt: new Date().toISOString(),
  ...params,
});

const createSetResult = (
  state: MatchStoreState,
  winner: TeamKey,
  nextScore: TeamScore,
  nextSets: TeamScore,
  type: MatchResult['type']
): MatchResult => ({
  type,
  winner,
  winningTeamName: teamNameForKey(state, winner),
  createdAt: new Date().toISOString(),
  score: cloneScore(nextScore),
  sets: cloneScore(nextSets),
  targetScore: state.targetScore,
  bestOf: state.bestOf,
});

const buildMatchConfig = (config: MatchConfig): MatchConfig => ({
  variant: config.variant,
  mode: config.mode,
  targetScore: normalizeTargetScore(config.targetScore),
  bestOf: config.bestOf,
  teamA: normalizeTeamName(config.teamA, 'Nos'),
  teamB: normalizeTeamName(config.teamB, 'Eles'),
});

const normalizeMatchConfig = (value: unknown): MatchConfig => {
  const source = isRecord(value) ? value : {};

  return buildMatchConfig({
    variant: normalizeVariant(source.variant),
    mode: normalizeMode(source.mode),
    targetScore: normalizeTargetScore(source.targetScore),
    bestOf: normalizeBestOf(source.bestOf),
    teamA: normalizeTeamName(source.teamA, DEFAULT_MATCH_CONFIG.teamA),
    teamB: normalizeTeamName(source.teamB, DEFAULT_MATCH_CONFIG.teamB),
  });
};

const normalizePhaseValue = (value: unknown): MatchPhase | null => {
  const normalizedValue = normalizeText(value);

  switch (normalizedValue) {
    case 'idle':
    case 'inProgress':
    case 'setOver':
    case 'matchOver':
      return normalizedValue;
    default:
      return null;
  }
};

const normalizeRealtimeConfig = (value: unknown): RealtimeConfig => {
  if (!isRecord(value)) {
    return createRealtimeConfig();
  }

  return {
    provider: 'firebase-firestore',
    roomId: normalizeText(value.roomId) || null,
    syncStatus: 'disabled',
  };
};

const normalizeCreatedAt = (value: unknown): string => {
  const parsed = typeof value === 'string' || typeof value === 'number' ? new Date(value) : null;

  if (parsed && !Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return new Date().toISOString();
};

const normalizeHistoryType = (
  value: unknown,
  points?: number,
  title?: unknown
): HistoryEntryType => {
  const normalizedValue = normalizeText(value);

  switch (normalizedValue) {
    case 'start-match':
    case 'add-points':
    case 'new-set':
    case 'reset-match':
      return normalizedValue;
    default: {
      const normalizedTitle = normalizeText(title).toLowerCase();

      if (normalizedTitle.includes('iniciada')) {
        return 'start-match';
      }

      if (normalizedTitle.includes('reiniciada')) {
        return 'reset-match';
      }

      if (normalizedTitle.includes('queda')) {
        return 'new-set';
      }

      return typeof points === 'number' && points > 0 ? 'add-points' : 'start-match';
    }
  }
};

const derivePhase = (params: {
  rawPhase: MatchPhase | null;
  score: TeamScore;
  sets: TeamScore;
  targetScore: number;
  bestOf: BestOf;
  pendingResult: MatchResult | null;
  hasHistory: boolean;
}): MatchPhase => {
  const { rawPhase, score, sets, targetScore, bestOf, pendingResult, hasHistory } = params;
  const setsToWin = getSetsToWin(bestOf);
  const hasScore = score.teamA > 0 || score.teamB > 0 || sets.teamA > 0 || sets.teamB > 0;

  if (
    rawPhase === 'matchOver' ||
    pendingResult?.type === 'match' ||
    sets.teamA >= setsToWin ||
    sets.teamB >= setsToWin
  ) {
    return 'matchOver';
  }

  if (
    rawPhase === 'setOver' ||
    pendingResult?.type === 'set' ||
    score.teamA >= targetScore ||
    score.teamB >= targetScore
  ) {
    return 'setOver';
  }

  if (rawPhase === 'inProgress') {
    return 'inProgress';
  }

  if (rawPhase === 'idle') {
    return hasHistory || hasScore ? 'inProgress' : 'idle';
  }

  return hasHistory || hasScore ? 'inProgress' : 'idle';
};

const normalizeMatchResult = (
  value: unknown,
  config: MatchConfig
): MatchResult | null => {
  if (!isRecord(value)) {
    return null;
  }

  const type = normalizeText(value.type);
  const winner = normalizeText(value.winner);

  if ((type !== 'set' && type !== 'match') || (winner !== 'teamA' && winner !== 'teamB')) {
    return null;
  }

  const normalizedWinner = winner as TeamKey;
  const score = normalizeTeamScore(value.score);
  const sets = normalizeTeamScore(value.sets);

  return {
    type,
    winner: normalizedWinner,
    winningTeamName: normalizeTeamName(
      value.winningTeamName,
      normalizedWinner === 'teamA' ? config.teamA : config.teamB
    ),
    createdAt: normalizeCreatedAt(value.createdAt),
    score,
    sets,
    targetScore: normalizeTargetScore(value.targetScore ?? config.targetScore),
    bestOf: normalizeBestOf(value.bestOf ?? config.bestOf),
  };
};

const normalizeSnapshot = (value: unknown): MatchSnapshot => {
  const source = isRecord(value) ? value : {};
  const config = normalizeMatchConfig(source);
  const currentScore = normalizeTeamScore(source.currentScore);
  const sets = normalizeTeamScore(source.sets);
  const pendingResult = normalizeMatchResult(source.pendingResult, config);
  const realtime = normalizeRealtimeConfig(source.realtime);
  const phase = derivePhase({
    rawPhase: normalizePhaseValue(source.phase),
    score: currentScore,
    sets,
    targetScore: config.targetScore,
    bestOf: config.bestOf,
    pendingResult,
    hasHistory: false,
  });

  return {
    ...config,
    currentScore,
    sets,
    phase,
    pendingResult,
    realtime,
  };
};

const getFallbackHistoryTitle = (
  type: HistoryEntryType,
  after: MatchSnapshot,
  points?: number
): string => {
  switch (type) {
    case 'start-match':
      return 'Nova partida iniciada';
    case 'new-set':
      return 'Nova queda preparada';
    case 'reset-match':
      return 'Partida reiniciada';
    case 'add-points':
    default:
      if (after.phase === 'matchOver') {
        return 'Partida encerrada';
      }

      if (after.phase === 'setOver') {
        return 'Queda vencida';
      }

      return typeof points === 'number' && points > 0 ? `Pontuacao aplicada +${points}` : 'Pontuacao aplicada';
  }
};

const getFallbackHistoryDescription = (
  type: HistoryEntryType,
  after: MatchSnapshot,
  points?: number
): string => {
  switch (type) {
    case 'start-match':
      return `${after.teamA} x ${after.teamB} com alvo em ${after.targetScore} pontos.`;
    case 'new-set':
      return 'O placar da queda atual foi zerado para continuar a disputa.';
    case 'reset-match':
      return 'A serie foi reiniciada mantendo a configuracao principal.';
    case 'add-points':
    default:
      if (after.phase === 'matchOver') {
        return `${after.teamA} ${after.currentScore.teamA} x ${after.currentScore.teamB} ${after.teamB}.`;
      }

      if (after.phase === 'setOver') {
        return `Queda fechada em ${after.currentScore.teamA} x ${after.currentScore.teamB}.`;
      }

      return typeof points === 'number' && points > 0
        ? `Pontuacao adicionada. Placar atual: ${after.currentScore.teamA} x ${after.currentScore.teamB}.`
        : 'Lance recuperado do historico local.';
  }
};

const normalizeHistoryEntry = (value: unknown, index: number): HistoryEntry | null => {
  if (!isRecord(value)) {
    return null;
  }

  const after = normalizeSnapshot(value.after);
  const before = isRecord(value.before) ? normalizeSnapshot(value.before) : null;
  const points = normalizeScoreValue(value.points, 30);
  const team = normalizeText(value.team);
  const type = normalizeHistoryType(value.type, points || undefined, value.title);

  return {
    id: normalizeText(value.id) || `legacy-${index}-${createId()}`,
    type,
    createdAt: normalizeCreatedAt(value.createdAt),
    title: normalizeTeamName(value.title, getFallbackHistoryTitle(type, after, points || undefined)),
    description: normalizeTeamName(
      value.description,
      getFallbackHistoryDescription(type, after, points || undefined)
    ),
    undoable: Boolean(value.undoable && before),
    team: team === 'teamA' || team === 'teamB' ? (team as TeamKey) : undefined,
    points: points > 0 ? points : undefined,
    before,
    after,
  };
};

const createMatchSnapshot = (config: MatchConfig, phase: MatchPhase): MatchSnapshot => ({
  ...config,
  currentScore: createScore(),
  sets: createScore(),
  phase,
  pendingResult: null,
  realtime: createRealtimeConfig(),
});

const mergePersistedState = (persistedState: unknown, currentState: MatchStore): MatchStore => {
  const persisted = isRecord(persistedState) ? persistedState : {};
  const normalizedSnapshot = normalizeSnapshot(persisted);
  const history = Array.isArray(persisted.history)
    ? persisted.history
        .map((entry, index) => normalizeHistoryEntry(entry, index))
        .filter((entry): entry is HistoryEntry => entry !== null)
        .slice(-HISTORY_LIMIT)
    : [];
  const phase = derivePhase({
    rawPhase: normalizePhaseValue(persisted.phase),
    score: normalizedSnapshot.currentScore,
    sets: normalizedSnapshot.sets,
    targetScore: normalizedSnapshot.targetScore,
    bestOf: normalizedSnapshot.bestOf,
    pendingResult: normalizedSnapshot.pendingResult,
    hasHistory: history.length > 0,
  });

  return {
    ...currentState,
    ...normalizedSnapshot,
    phase,
    history,
    realtime: createRealtimeConfig(),
    scoreStyle: normalizeScoreStyle(persisted.scoreStyle),
  };
};

export const useMatchStore = create<MatchStore>()(
  persist(
    (set) => ({
      ...initialSnapshot,
      history: [],
      placementSeed: createPlacementSeed(),
      scoreStyle: DEFAULT_SCORE_STYLE,
      addPoints: (team, points) => {
        set((state) => {
          if (state.phase !== 'inProgress') {
            return state;
          }

          const before = snapshotFromState(state);
          const currentValue = state.currentScore[team];
          const nextValue = Math.min(state.targetScore, currentValue + points);
          const nextScore: TeamScore = {
            ...state.currentScore,
            [team]: nextValue,
          };

          let nextSets = cloneScore(state.sets);
          let nextPhase: MatchPhase = 'inProgress';
          let pendingResult: MatchResult | null = null;
          let title = `${teamNameForKey(state, team)} recebeu +${points}`;
          let description = `Placar atual: ${nextScore.teamA} x ${nextScore.teamB}.`;

          if (nextValue >= state.targetScore) {
            nextSets = {
              ...state.sets,
              [team]: state.sets[team] + 1,
            };

            const matchWon = nextSets[team] >= getSetsToWin(state.bestOf);
            nextPhase = matchWon ? 'matchOver' : 'setOver';
            pendingResult = createSetResult(
              state,
              team,
              nextScore,
              nextSets,
              matchWon ? 'match' : 'set'
            );
            title = matchWon ? 'Partida encerrada' : 'Queda vencida';
            description = `${teamNameForKey(state, team)} fechou em ${nextScore.teamA} x ${nextScore.teamB}.`;
          }

          const after: MatchSnapshot = {
            ...before,
            currentScore: nextScore,
            sets: nextSets,
            phase: nextPhase,
            pendingResult,
          };

          const historyEntry = createHistoryEntry({
            type: 'add-points',
            title,
            description,
            before,
            after,
            undoable: true,
            team,
            points,
          });

          return {
            currentScore: nextScore,
            sets: nextSets,
            phase: nextPhase,
            pendingResult,
            history: appendHistory(state.history, historyEntry),
          };
        });
      },
      clearLocalData: () => {
        set(() => ({
          ...initialSnapshot,
          history: [],
          placementSeed: createPlacementSeed(),
          scoreStyle: DEFAULT_SCORE_STYLE,
        }));
      },
      dismissPendingResult: () => {
        set((state) => {
          if (!state.pendingResult) {
            return state;
          }

          return {
            pendingResult: null,
          };
        });
      },
      resetCurrentSet: () => {
        set((state) => {
          if (state.phase === 'idle' || state.phase === 'matchOver') {
            return state;
          }

          const isAlreadyClean =
            state.currentScore.teamA === 0 &&
            state.currentScore.teamB === 0 &&
            state.phase === 'inProgress' &&
            state.pendingResult === null;

          if (isAlreadyClean) {
            return state;
          }

          const before = snapshotFromState(state);
          const after: MatchSnapshot = {
            ...before,
            currentScore: createScore(),
            phase: 'inProgress',
            pendingResult: null,
          };

          const historyEntry = createHistoryEntry({
            type: 'new-set',
            title: 'Nova queda preparada',
            description: 'O placar da queda atual foi zerado.',
            before,
            after,
            undoable: true,
          });

          return {
            currentScore: createScore(),
            phase: 'inProgress',
            pendingResult: null,
            placementSeed: createPlacementSeed(),
            history: appendHistory(state.history, historyEntry),
          };
        });
      },
      resetMatch: () => {
        set((state) => {
          if (state.phase === 'idle' && state.history.length === 0) {
            return state;
          }

          const before = snapshotFromState(state);
          const after: MatchSnapshot = {
            ...before,
            currentScore: createScore(),
            sets: createScore(),
            phase: 'inProgress',
            pendingResult: null,
            realtime: createRealtimeConfig(),
          };

          const historyEntry = createHistoryEntry({
            type: 'reset-match',
            title: 'Partida reiniciada',
            description: 'Quedas e placar foram zerados, mantendo a configuracao atual.',
            before,
            after,
            undoable: true,
          });

          return {
            currentScore: createScore(),
            sets: createScore(),
            phase: 'inProgress',
            pendingResult: null,
            placementSeed: createPlacementSeed(),
            realtime: createRealtimeConfig(),
            history: appendHistory(state.history, historyEntry),
          };
        });
      },
      setScoreStyle: (scoreStyle) => {
        set(() => ({
          scoreStyle: normalizeScoreStyle(scoreStyle),
        }));
      },
      startNewMatch: (config) => {
        set((state) => {
          const nextConfig = buildMatchConfig({
            ...config,
            mode: DEFAULT_MATCH_CONFIG.mode,
          });
          const before = snapshotFromState(state);
          const nextSnapshot = createMatchSnapshot(nextConfig, 'inProgress');
          const historyEntry = createHistoryEntry({
            type: 'start-match',
            title: 'Nova partida iniciada',
            description: `${nextSnapshot.teamA} x ${nextSnapshot.teamB} com alvo em ${nextSnapshot.targetScore} pontos.`,
            before,
            after: nextSnapshot,
            undoable: false,
          });

          return {
            ...nextSnapshot,
            placementSeed: createPlacementSeed(),
            history: appendHistory(state.history, historyEntry),
          };
        });
      },
      undoLastAction: () => {
        set((state) => {
          for (let index = state.history.length - 1; index >= 0; index -= 1) {
            const entry = state.history[index];

            if (!entry.undoable || entry.before === null) {
              continue;
            }

            const nextHistory = state.history.slice(0, index);

            return {
              ...entry.before,
              history: nextHistory,
            };
          }

          return state;
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      merge: mergePersistedState,
      partialize: (state) => ({
        variant: state.variant,
        mode: state.mode,
        targetScore: state.targetScore,
        bestOf: state.bestOf,
        teamA: state.teamA,
        teamB: state.teamB,
        currentScore: state.currentScore,
        sets: state.sets,
        history: state.history,
        phase: state.phase,
        pendingResult: state.pendingResult,
        realtime: state.realtime,
        scoreStyle: state.scoreStyle,
      }),
    }
  )
);

export const matchStoreSelectors = {
  canUndo: (state: MatchStoreState): boolean =>
    state.history.some((entry) => entry.undoable && entry.before !== null),
  hasActiveMatch: (state: MatchStoreState): boolean => state.phase !== 'idle',
};
