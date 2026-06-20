export type CardCoverState = {
  face: 'back' | 'front';
  rotate: number;
  scale?: number;
  x: number;
  y: number;
};

export const paulistaTenCardStates: Record<number, CardCoverState> = {
  0:  { x: 6,   y: 15,   rotate: 0,  face: 'back' },
  1:  { x: 18,  y: 26,  rotate: 0,  face: 'back' },
  2:  { x: 20,  y: 18,  rotate: 35, face: 'back' },
  3:  { x: 0,  y: 40,  rotate: 89,  face: 'back' },
  4:  { x: 0,  y: 55,  rotate: 90,  face: 'back' },
  5:  { x: 8,  y: 65,  rotate: 55,  face: 'back' },
  6:  { x: 0,  y: 75,  rotate: 90,  face: 'back' },
  7:  { x: 62,   y: 18,  rotate: 0,   face: 'back' },
  8:  { x: 62,   y: 62,  rotate: 0,   face: 'back'},
  9:  { x: 62,   y: 92,  rotate: 0,   face: 'back' },
  10: { x: 62,   y: 122,  rotate: 0,   face: 'back' },
  11: { x: 110,   y: 100,  rotate: 90,   face: 'back' },
  12: { x: 0,   y: 0,   rotate: -4,  face: 'front' },
};

export const spanishNineFirstPhaseStates: Record<number, CardCoverState> = {
  0: { x: 15,   y: 20,   rotate: -0,  face: 'back' },
  1: { x: 20,  y: 25,  rotate: 45, face: 'back' },
  2: { x: 0,  y: 50,  rotate: 90, face: 'back' },
  3: { x: 15,  y: 60,  rotate: 60,  face: 'back' },
  4: { x: 40,  y: 20,  rotate: 0,  face: 'back' },
  5: { x: 60,  y: 20,  rotate: 0,  face: 'back' },
  6: { x: 60,   y: 67,  rotate: 0,  face: 'back' },
  7: { x: 60,   y:97,  rotate: 0,  face: 'back' },
  8: { x: 60,   y: 127,  rotate: 0,   face: 'back' },
  9: { x: 60,   y: 157,  rotate: 0,   face: 'back' },
};

export const spanishNineSecondPhaseStates: Record<number, CardCoverState> = {
  10: { x: 20,  y: 25,  rotate: 45, face: 'front' },
  11: { x: 0,  y: 50,  rotate: 90, face: 'front' },
  12: { x: 15,  y: 60,  rotate: 60,  face: 'front' },
  13: { x: 40,  y: 20,  rotate: 0,  face: 'front' },
  14: { x: 60,  y: 20,  rotate: 0,  face: 'front' },
  15: { x: 60,   y: 67,  rotate: 0,  face: 'front' },
  16: { x: 60,   y:97,  rotate: 0,  face: 'front' },
  17: { x: 60,   y: 127,  rotate: 0,   face: 'front' },
  18: { x: 60,   y: 157,  rotate: 0,   face: 'front' },
};

export const spanishCardStates: Record<number, CardCoverState> = {
  ...spanishNineFirstPhaseStates,
  ...spanishNineSecondPhaseStates,
};
