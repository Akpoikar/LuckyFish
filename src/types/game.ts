/**
 * Lucky Fish - Game types
 */

export type GamePhase = 'waiting' | 'running' | 'crashed';

export interface GameState {
  phase: GamePhase;
  multiplier: number;
  roundId: string;
}
