/**
 * Lucky Fishy - API types
 * Shared types for API requests and responses
 */

/* --- User --- */

export interface BalanceResponse {
  balance: number;
}

/* --- Game --- */

export interface PlayRequest {
  betAmount: number;
  level: number; // 1-10
}

export interface PlayResponse {
  roundId: string;
  currentLevel: number;
  bubbleCount: number;
  balance: number;
}

export interface BubbleResult {
  index: number;
  hasBomb: boolean;
}

export interface BubbleClickRequest {
  bubbleIndex: number;
}

export interface BubbleClickResponse {
  bubbles: BubbleResult[];
  win: boolean;
  clickedBubbleHadBomb: boolean;
  newLevel?: number;
  payout?: number;
  balance: number;
}

export interface CashoutResponse {
  payout: number;
  balance: number;
}
