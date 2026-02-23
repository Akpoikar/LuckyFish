import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { walletAuthenticate } from '@/api/client';
import type { WalletAuthenticateResponse } from '@/api/types';
import { extractUrlParams } from '@/utils/urlParams';

type AuthStatus = 'loading' | 'ready' | 'error';

interface AuthState {
  status: AuthStatus;
  sessionID: string | null;
  rgsUrl: string | null;
  balance: number;
  currency: string;
  config: WalletAuthenticateResponse['config'] | null;
  round: unknown;
  error: string | null;
}

const defaultConfig = {
  minBet: 100000,
  maxBet: 1000000000,
  stepBet: 100000,
  defaultBetLevel: 1000000,
  betLevels: [100000, 500000, 1000000, 5000000, 10000000, 25000000, 50000000, 100000000, 500000000],
  jurisdiction: {},
};

const AuthContext = createContext<AuthState | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    status: 'loading',
    sessionID: null,
    rgsUrl: null,
    balance: 0,
    currency: 'USD',
    config: null,
    round: null,
    error: null,
  });

  const runAuth = useCallback(async () => {
    const params = extractUrlParams();
    const { sessionID, rgs_url } = params;

    if (!sessionID || !rgs_url) {
      // Dev/sandbox: no RGS params - use mock response
      const mockBalance = params.balance ? parseInt(params.balance, 10) : 1000000000;
      setState({
        status: 'ready',
        sessionID: null,
        rgsUrl: null,
        balance: mockBalance,
        currency: params.currency ?? 'USD',
        config: defaultConfig,
        round: null,
        error: null,
      });
      return;
    }

    try {
      const res = await walletAuthenticate(rgs_url, { sessionID });
      setState({
        status: 'ready',
        sessionID,
        rgsUrl: rgs_url,
        balance: res.balance.amount,
        currency: res.balance.currency,
        config: res.config,
        round: res.round ?? null,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed';
      setState((s) => ({
        ...s,
        status: 'error',
        error: message,
      }));
    }
  }, []);

  useEffect(() => {
    runAuth();
  }, [runAuth]);

  return (
    <AuthContext.Provider value={state}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
