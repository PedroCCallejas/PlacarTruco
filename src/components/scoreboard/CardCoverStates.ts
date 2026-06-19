export type CardCoverState = {
  face: 'back' | 'front';
  rotate: number;
  scale?: number;
  x: number;
  y: number;
};

export const paulistaCardStates: Record<number, CardCoverState> = {
  0:  { x: 0,   y: 0,   rotate: -8,  face: 'back' },
  1:  { x: 36,  y: 42,  rotate: -12, face: 'back' },
  2:  { x: 30,  y: 36,  rotate: -10, face: 'back' },
  3:  { x: 24,  y: 30,  rotate: -8,  face: 'back' },
  4:  { x: 18,  y: 26,  rotate: -6,  face: 'back' },
  5:  { x: 12,  y: 20,  rotate: -4,  face: 'back' },
  6:  { x: 8,   y: 16,  rotate: -2,  face: 'back' },
  7:  { x: 4,   y: 12,  rotate: 0,   face: 'back' },
  8:  { x: 0,   y: 8,   rotate: 2,   face: 'back' },
  9:  { x: -4,  y: 4,   rotate: 4,   face: 'back' },
  10: { x: -8,  y: 0,   rotate: 6,   face: 'back' },
  11: { x: -12, y: -4,  rotate: 8,   face: 'back' },
  12: { x: -16, y: -8,  rotate: 10,  face: 'back' },
};

const spanishFirstPhaseStates: Record<number, CardCoverState> = {
  0: { x: 0,   y: 0,   rotate: -8,  face: 'back' },
  1: { x: 34,  y: 40,  rotate: -12, face: 'back' },
  2: { x: 28,  y: 34,  rotate: -10, face: 'back' },
  3: { x: 22,  y: 28,  rotate: -8,  face: 'back' },
  4: { x: 16,  y: 22,  rotate: -6,  face: 'back' },
  5: { x: 10,  y: 16,  rotate: -4,  face: 'back' },
  6: { x: 6,   y: 12,  rotate: -2,  face: 'back' },
  7: { x: 2,   y: 8,   rotate: 0,   face: 'back' },
  8: { x: -2,  y: 4,   rotate: 2,   face: 'back' },
  9: { x: -6,  y: 0,   rotate: 4,   face: 'back' },
};

const spanishSecondPhaseStates: Record<number, CardCoverState> = {
  10: { x: 34,  y: 40,  rotate: -12, face: 'front' },
  11: { x: 28,  y: 34,  rotate: -10, face: 'front' },
  12: { x: 22,  y: 28,  rotate: -8,  face: 'front' },
  13: { x: 16,  y: 22,  rotate: -6,  face: 'front' },
  14: { x: 10,  y: 16,  rotate: -4,  face: 'front' },
  15: { x: 6,   y: 12,  rotate: -2,  face: 'front' },
  16: { x: 2,   y: 8,   rotate: 0,   face: 'front' },
  17: { x: -2,  y: 4,   rotate: 2,   face: 'front' },
  18: { x: -6,  y: 0,   rotate: 4,   face: 'front' },
};

export const spanishCardStates: Record<number, CardCoverState> = {
  ...spanishFirstPhaseStates,
  ...spanishSecondPhaseStates,
};
