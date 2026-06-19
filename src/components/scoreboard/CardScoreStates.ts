export interface CardSignalPoint {
  height?: number;
  radius?: number;
  width?: number;
  x: number;
  y: number;
}

export interface CardVisualState {
  activeSignalIndices: number[];
  baseSignals: number;
  face: 'back' | 'front';
  rotateDeg: number;
  shiftX: number;
  shiftY: number;
  topSignals: number;
}

export const PAULISTA_SIGNAL_POINTS: CardSignalPoint[] = [
  { x: 0.12, y: 0.11, width: 0.18, height: 0.13, radius: 0.22 },
  { x: 0.14, y: 0.22, width: 0.12, height: 0.09, radius: 0.5 },
  { x: 0.30, y: 0.25, width: 0.18, height: 0.12, radius: 0.42 },
  { x: 0.70, y: 0.25, width: 0.18, height: 0.12, radius: 0.42 },
  { x: 0.50, y: 0.37, width: 0.17, height: 0.11, radius: 0.42 },
  { x: 0.30, y: 0.48, width: 0.18, height: 0.12, radius: 0.42 },
  { x: 0.70, y: 0.48, width: 0.18, height: 0.12, radius: 0.42 },
  { x: 0.30, y: 0.67, width: 0.18, height: 0.12, radius: 0.42 },
  { x: 0.50, y: 0.77, width: 0.17, height: 0.11, radius: 0.42 },
  { x: 0.70, y: 0.67, width: 0.18, height: 0.12, radius: 0.42 },
  { x: 0.86, y: 0.82, width: 0.12, height: 0.09, radius: 0.5 },
  { x: 0.86, y: 0.90, width: 0.18, height: 0.13, radius: 0.22 },
];

export const SPANISH_SIGNAL_POINTS: CardSignalPoint[] = [
  { x: 0.24, y: 0.34, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.50, y: 0.34, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.76, y: 0.34, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.24, y: 0.49, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.50, y: 0.49, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.76, y: 0.49, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.24, y: 0.65, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.50, y: 0.65, width: 0.19, height: 0.11, radius: 0.5 },
  { x: 0.76, y: 0.65, width: 0.19, height: 0.11, radius: 0.5 },
];

const PAULISTA_REVEAL_ORDER = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0] as const;
const SPANISH_REVEAL_ORDER = [6, 7, 8, 3, 4, 5, 0, 1, 2] as const;

function reveal(order: readonly number[], count: number): number[] {
  return order.slice(0, count);
}

export const paulistaCardStates: Record<number, CardVisualState> = {
  0: { activeSignalIndices: [], baseSignals: 0, face: 'back', rotateDeg: 16, shiftX: -0.09, shiftY: 0.08, topSignals: 0 },
  1: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 1), baseSignals: 1, face: 'back', rotateDeg: 15, shiftX: -0.07, shiftY: 0.07, topSignals: 0 },
  2: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 2), baseSignals: 2, face: 'back', rotateDeg: 14, shiftX: -0.05, shiftY: 0.05, topSignals: 0 },
  3: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 3), baseSignals: 3, face: 'back', rotateDeg: 13, shiftX: -0.02, shiftY: 0.03, topSignals: 0 },
  4: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 4), baseSignals: 4, face: 'back', rotateDeg: 11, shiftX: 0.01, shiftY: 0.01, topSignals: 0 },
  5: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 5), baseSignals: 5, face: 'back', rotateDeg: 9, shiftX: 0.04, shiftY: -0.01, topSignals: 0 },
  6: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 6), baseSignals: 6, face: 'back', rotateDeg: 7, shiftX: 0.08, shiftY: -0.04, topSignals: 0 },
  7: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 7), baseSignals: 7, face: 'back', rotateDeg: 5, shiftX: 0.12, shiftY: -0.07, topSignals: 0 },
  8: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 8), baseSignals: 8, face: 'back', rotateDeg: 3, shiftX: 0.16, shiftY: -0.10, topSignals: 0 },
  9: { activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 9), baseSignals: 9, face: 'back', rotateDeg: 1, shiftX: 0.20, shiftY: -0.13, topSignals: 0 },
  10:{ activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 10), baseSignals: 10, face: 'back', rotateDeg: -1, shiftX: 0.24, shiftY: -0.16, topSignals: 0 },
  11:{ activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 11), baseSignals: 11, face: 'back', rotateDeg: -4, shiftX: 0.28, shiftY: -0.20, topSignals: 0 },
  12:{ activeSignalIndices: reveal(PAULISTA_REVEAL_ORDER, 12), baseSignals: 12, face: 'back', rotateDeg: -7, shiftX: 0.33, shiftY: -0.24, topSignals: 0 },
};

export const spanishCardStatesFirstPhase: Record<number, CardVisualState> = {
  0: { activeSignalIndices: [], baseSignals: 0, face: 'back', rotateDeg: 15, shiftX: -0.06, shiftY: 0.06, topSignals: 0 },
  1: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 1), baseSignals: 1, face: 'back', rotateDeg: 14, shiftX: -0.04, shiftY: 0.05, topSignals: 0 },
  2: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 2), baseSignals: 2, face: 'back', rotateDeg: 13, shiftX: -0.02, shiftY: 0.03, topSignals: 0 },
  3: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 3), baseSignals: 3, face: 'back', rotateDeg: 11, shiftX: 0.01, shiftY: 0.01, topSignals: 0 },
  4: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 4), baseSignals: 4, face: 'back', rotateDeg: 9, shiftX: 0.04, shiftY: -0.01, topSignals: 0 },
  5: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 5), baseSignals: 5, face: 'back', rotateDeg: 7, shiftX: 0.08, shiftY: -0.03, topSignals: 0 },
  6: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 6), baseSignals: 6, face: 'back', rotateDeg: 5, shiftX: 0.12, shiftY: -0.06, topSignals: 0 },
  7: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 7), baseSignals: 7, face: 'back', rotateDeg: 3, shiftX: 0.16, shiftY: -0.09, topSignals: 0 },
  8: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 8), baseSignals: 8, face: 'back', rotateDeg: 1, shiftX: 0.20, shiftY: -0.12, topSignals: 0 },
  9: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 9), baseSignals: 9, face: 'back', rotateDeg: -2, shiftX: 0.24, shiftY: -0.15, topSignals: 0 },
};

export const spanishCardStatesSecondPhase: Record<number, CardVisualState> = {
  10: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 1), baseSignals: 9, face: 'front', rotateDeg: -11, shiftX: 0.32, shiftY: -0.08, topSignals: 1 },
  11: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 2), baseSignals: 9, face: 'front', rotateDeg: -10, shiftX: 0.35, shiftY: -0.10, topSignals: 2 },
  12: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 3), baseSignals: 9, face: 'front', rotateDeg: -9, shiftX: 0.38, shiftY: -0.12, topSignals: 3 },
  13: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 4), baseSignals: 9, face: 'front', rotateDeg: -8, shiftX: 0.41, shiftY: -0.14, topSignals: 4 },
  14: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 5), baseSignals: 9, face: 'front', rotateDeg: -7, shiftX: 0.44, shiftY: -0.16, topSignals: 5 },
  15: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 6), baseSignals: 9, face: 'front', rotateDeg: -6, shiftX: 0.47, shiftY: -0.18, topSignals: 6 },
  16: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 7), baseSignals: 9, face: 'front', rotateDeg: -6, shiftX: 0.50, shiftY: -0.20, topSignals: 7 },
  17: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 8), baseSignals: 9, face: 'front', rotateDeg: -5, shiftX: 0.53, shiftY: -0.22, topSignals: 8 },
  18: { activeSignalIndices: reveal(SPANISH_REVEAL_ORDER, 9), baseSignals: 9, face: 'front', rotateDeg: -4, shiftX: 0.56, shiftY: -0.24, topSignals: 9 },
};

export const spanishCardStates: Record<number, CardVisualState> = {
  ...spanishCardStatesFirstPhase,
  ...spanishCardStatesSecondPhase,
};
