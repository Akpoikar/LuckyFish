/**
 * Lucky Fishy - API types
 * Shared types for API requests and responses
 */

/* --- Wallet (RGS) --- */

export interface WalletAuthenticateRequest {
  sessionID: string;
}

export interface WalletBalance {
  amount: number;
  currency: string;
}

export interface WalletBetConfig {
  minBet: number;
  maxBet: number;
  stepBet: number;
  defaultBetLevel: number;
  betLevels: number[];
}

export interface WalletJurisdiction {
  socialCasino?: boolean;
  disabledFullscreen?: boolean;
  disabledTurbo?: boolean;
  [key: string]: unknown;
}

export interface WalletConfig {
  minBet: number;
  maxBet: number;
  stepBet: number;
  defaultBetLevel: number;
  betLevels: number[];
  jurisdiction?: WalletJurisdiction;
}

export interface WalletAuthenticateResponse {
  balance: WalletBalance;
  config: WalletConfig;
  round?: unknown; // Active or last completed round - structure TBD
}

/* --- User --- */

export interface BalanceResponse {
  balance: number;
}

/* --- Game --- */

export interface PlayRequest {
  betAmount: number;
  level: number; // 1-9
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
