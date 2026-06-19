import type { BestOf, MatchMode, MatchPhase, ScoreStyle, TeamKey, TrucoVariant } from '@/types/match';

export interface ScoreAction {
  points: number;
  label: string;
  description: string;
}

export interface VariantOption {
  id: TrucoVariant;
  label: string;
  description: string;
  scoreActions: ScoreAction[];
}

export interface ModeOption {
  id: MatchMode;
  label: string;
  description: string;
  enabled: boolean;
}

export interface BestOfOption {
  value: BestOf;
  label: string;
  description: string;
}

export interface ScoreStyleOption {
  id: ScoreStyle;
  label: string;
  shortLabel: string;
  description: string;
}

const defaultScoreActions: ScoreAction[] = [
  { points: 1, label: '+1', description: 'Mao' },
  { points: 3, label: '+3', description: 'Truco' },
  { points: 6, label: '+6', description: 'Seis' },
  { points: 9, label: '+9', description: 'Nove' },
  { points: 12, label: '+12', description: 'Doze' },
];

export const TRUCO_VARIANTS: VariantOption[] = [
  {
    id: 'truco-paulista',
    label: 'Truco Paulista',
    description: 'Regras brasileiras com escalada de mao, truco, seis, nove e doze.',
    scoreActions: defaultScoreActions,
  },
  {
    id: 'truco-espanhol',
    label: 'Truco Espanhol',
    description: 'Estrutura pronta para regras dedicadas; por enquanto usa os mesmos atalhos.',
    scoreActions: defaultScoreActions,
  },
];

export const MATCH_MODE_OPTIONS: ModeOption[] = [
  {
    id: 'single-device',
    label: 'Um celular',
    description: 'Placar local em uma mesa compartilhada.',
    enabled: true,
  },
  {
    id: 'dual-device',
    label: 'Dois celulares',
    description: 'Em breve no MVP local.',
    enabled: false,
  },
];

export const BEST_OF_OPTIONS: BestOfOption[] = [
  { value: 1, label: 'Melhor de 1', description: 'Uma queda decide a partida.' },
  { value: 3, label: 'Melhor de 3', description: 'Vence quem levar duas quedas.' },
  { value: 5, label: 'Melhor de 5', description: 'Ideal para partidas mais longas.' },
];

export const TARGET_SCORE_PRESETS = [12, 15, 18] as const;

export const SCORE_STYLE_OPTIONS: ScoreStyleOption[] = [
  {
    id: 'cards',
    label: 'Carta',
    shortLabel: 'Carta',
    description: 'Duas cartas sobrepostas por lado, com marcacao manual e virada visual forte.',
  },
  {
    id: 'beans',
    label: 'Feijao',
    shortLabel: 'Feijao',
    description: 'Marcacao rustica com feijoes organicos, cara de truco raiz sobre a mesa.',
  },
  {
    id: 'crystals',
    label: 'Cristal',
    shortLabel: 'Cristal',
    description: 'Pedras lapidadas com brilho sutil e leitura premium para cada time.',
  },
];

export const DEFAULT_MATCH_CONFIG = {
  variant: 'truco-paulista',
  mode: 'single-device',
  targetScore: 12,
  bestOf: 3,
  teamA: 'Nos',
  teamB: 'Eles',
} as const satisfies {
  variant: TrucoVariant;
  mode: MatchMode;
  targetScore: number;
  bestOf: BestOf;
  teamA: string;
  teamB: string;
};

export function getScoreActionsForVariant(variant: TrucoVariant): ScoreAction[] {
  return TRUCO_VARIANTS.find((item) => item.id === variant)?.scoreActions ?? defaultScoreActions;
}

export function getSetsToWin(bestOf: BestOf): number {
  return Math.ceil(bestOf / 2);
}

export function getVariantLabel(variant: TrucoVariant): string {
  return TRUCO_VARIANTS.find((item) => item.id === variant)?.label ?? 'Truco';
}

export function getModeLabel(mode: MatchMode): string {
  return MATCH_MODE_OPTIONS.find((item) => item.id === mode)?.label ?? 'Modo';
}

export function getScoreStyleLabel(scoreStyle: ScoreStyle): string {
  return SCORE_STYLE_OPTIONS.find((item) => item.id === scoreStyle)?.label ?? 'Carta';
}

export function getPhaseLabel(phase: MatchPhase): string {
  switch (phase) {
    case 'idle':
      return 'Sem partida ativa';
    case 'inProgress':
      return 'Partida em andamento';
    case 'setOver':
      return 'Queda encerrada';
    case 'matchOver':
      return 'Partida encerrada';
    default:
      return 'Status indisponivel';
  }
}

export function getTeamLabel(team: TeamKey): string {
  return team === 'teamA' ? 'Time A' : 'Time B';
}
