/**
 * Lucky Fishy - API client
 * Stub implementations - will be wired to backend when ready
 */

import type {
  BalanceResponse,
  PlayRequest,
  PlayResponse,
  BubbleClickRequest,
  BubbleClickResponse,
  CashoutResponse,
} from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/* --- User --- */

export async function getUserBalance(): Promise<BalanceResponse> {
  return apiFetch<BalanceResponse>('/user/balance');
}

/* --- Game --- */

export async function play(data: PlayRequest): Promise<PlayResponse> {
  return apiFetch<PlayResponse>('/game/play', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function bubbleClick(
  roundId: string,
  data: BubbleClickRequest
): Promise<BubbleClickResponse> {
  return apiFetch<BubbleClickResponse>(`/game/round/${roundId}/bubble-click`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function cashout(roundId: string): Promise<CashoutResponse> {
  return apiFetch<CashoutResponse>(`/game/round/${roundId}/cashout`, {
    method: 'POST',
  });
}
