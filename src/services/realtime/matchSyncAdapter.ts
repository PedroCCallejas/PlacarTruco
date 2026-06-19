import type { MatchConfig, MatchSnapshot } from '@/types/match';

export interface MatchSyncAdapter {
  provider: 'firebase-firestore';
  createRoom: (config: MatchConfig) => Promise<string>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  publishSnapshot: (roomId: string, snapshot: MatchSnapshot) => Promise<void>;
  subscribe: (roomId: string, onSnapshot: (snapshot: MatchSnapshot) => void) => () => void;
}

const unavailable = async () => {
  throw new Error(
    'O modo com 2 celulares ainda nao esta disponivel neste MVP local. A estrutura permanece preparada para uma integracao futura.'
  );
};

export const disabledMatchSyncAdapter: MatchSyncAdapter = {
  provider: 'firebase-firestore',
  createRoom: unavailable,
  joinRoom: unavailable,
  leaveRoom: unavailable,
  publishSnapshot: unavailable,
  subscribe: () => () => undefined,
};
