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
  WalletAuthenticateRequest,
  WalletAuthenticateResponse,
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

/* --- Wallet (RGS) --- */

/**
 * Authenticates the session with the operator's Wallet API.
 * Must be called before other wallet endpoints.
 * rgs_url may be a hostname (e.g. rgsd.stake-engine.com) or full URL - we ensure https://.
 */
export async function walletAuthenticate(
  rgsUrl: string,
  data: WalletAuthenticateRequest
): Promise<WalletAuthenticateResponse> {
  const trimmed = rgsUrl.replace(/\/$/, '');
  const base =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;
  const url = `${base}/wallet/authenticate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Wallet authenticate failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
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
