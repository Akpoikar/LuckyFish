import { useCallback, useEffect, useRef, useState } from 'react';
import { getMultiplier } from '@/game/gameConfig';
import {
  formatDisplayBalance,
  formatAmountForDisplay,
  parseDisplayToInternal,
  CURRENCY_META,
  MONEY_PRECISION,
} from '@/utils/currency';

const FALLBACK_MIN_BET = 1 * MONEY_PRECISION;
const FALLBACK_MAX_BET = 10000 * MONEY_PRECISION;
const FALLBACK_DEFAULT_BET = 1 * MONEY_PRECISION;
const FALLBACK_BALANCE = 10000 * MONEY_PRECISION;

interface BettingPanelProps {
  round?: number;
  gameStarted?: boolean;
  initialBalance?: number;
  minBet?: number;
  maxBet?: number;
  defaultBet?: number;
  stepBet?: number;
  betLevels?: number[];
  currencyCode?: string;
  onGameStart?: () => void;
  onGameEnd?: () => void;
  onStartRequest?: (start: () => void) => void;
}

export function BettingPanel({
  round = 1,
  gameStarted = false,
  initialBalance = FALLBACK_BALANCE,
  minBet = FALLBACK_MIN_BET,
  maxBet = FALLBACK_MAX_BET,
  defaultBet = FALLBACK_DEFAULT_BET,
  stepBet,
  betLevels,
  currencyCode = 'USD',
  onGameStart,
  onGameEnd,
  onStartRequest,
}: BettingPanelProps) {
  const effectiveStepBet = stepBet ?? Math.max(1, Math.floor((maxBet - minBet) / 10));
  const initialBet = (() => {
    const val = Math.max(minBet, Math.min(maxBet, defaultBet));
    const snapped = Math.round(val / effectiveStepBet) * effectiveStepBet;
    return Math.max(minBet, Math.min(maxBet, snapped));
  })();
  const [balance, setBalance] = useState(initialBalance);
  const [bet, setBet] = useState(initialBet);
  const prevGameStartedRef = useRef(gameStarted);

  /** Snap value to nearest valid step (divisible by stepBet), clamped to min/max */
  const snapToStep = useCallback(
    (value: number, step: number) => {
      const snapped = Math.round(value / step) * step;
      return Math.max(minBet, Math.min(maxBet, snapped));
    },
    [minBet, maxBet]
  );

  const clampBet = useCallback(
    (value: number) => snapToStep(value, effectiveStepBet),
    [snapToStep, effectiveStepBet]
  );

  const handleBetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d.]/g, '').replace(/^(\d+\.\d*)\..*$/, '$1');
      if (raw === '' || raw === '.') {
        setBet(minBet);
        return;
      }
      const internal = parseDisplayToInternal(raw);
      if (internal !== null) setBet(clampBet(internal));
    },
    [clampBet, minBet]
  );

  const handleBetBlur = useCallback(() => {
    setBet((b) => clampBet(b));
  }, [clampBet]);

  const handleBetUp = useCallback(() => {
    if (betLevels?.length) {
      const nextIdx = betLevels.findIndex((l) => l > bet);
      const level = nextIdx < 0 ? betLevels[betLevels.length - 1]! : betLevels[nextIdx]!;
      setBet(level);
    } else {
      setBet((b) => clampBet(b + effectiveStepBet));
    }
  }, [bet, betLevels, clampBet, effectiveStepBet]);

  const handleBetDown = useCallback(() => {
    if (betLevels?.length) {
      const idx = betLevels.findIndex((l) => l >= bet);
      const prevIdx = idx <= 0 ? 0 : idx - 1;
      const level = betLevels[prevIdx]!;
      setBet(level);
    } else {
      setBet((b) => clampBet(b - effectiveStepBet));
    }
  }, [bet, betLevels, clampBet, effectiveStepBet]);

  useEffect(() => {
    if (gameStarted && !prevGameStartedRef.current) {
      setBalance((b) => (b >= bet ? b - bet : b));
    }
    prevGameStartedRef.current = gameStarted;
  }, [gameStarted, bet]);

  const handlePlay = useCallback(() => {
    if (bet > balance || bet < minBet) return;
    onGameStart?.();
  }, [bet, balance, minBet, onGameStart]);

  useEffect(() => {
    onStartRequest?.(handlePlay);
  }, [handlePlay, onStartRequest]);

  const handleCashOut = useCallback(() => {
    const multiplier = getMultiplier(round);
    const payout = bet * multiplier;
    setBalance((b) => b + payout);
    onGameEnd?.();
  }, [round, bet, onGameEnd]);

  const canPlay = !gameStarted && bet <= balance && bet >= minBet;
  const showCashOut = gameStarted && round > 1;
  const cashOutAmount = showCashOut ? bet * getMultiplier(round) : 0;

  return (
    <div className="betting-panel">
      <div className="betting-panel__row">
        <div className="betting-panel__left">
          <div className="betting-card betting-card--balance">
            <span className="betting-card__label">BALANCE</span>
            <span className="betting-card__value">
              {formatDisplayBalance({ amount: balance, currency: currencyCode })}
            </span>
          </div>
        </div>

        {showCashOut ? (
          <button
            type="button"
            className="play-button play-button--cashout"
            onClick={handleCashOut}
            aria-label="Cash out"
          >
            <span className="play-button__cashout-label">CASH OUT</span>
            <span className="play-button__cashout-amount">
              {formatDisplayBalance({ amount: cashOutAmount, currency: currencyCode })}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className="play-button"
            onClick={handlePlay}
            disabled={!canPlay}
            aria-label="Play"
          >
            <span className="play-button__icon" aria-hidden>▶</span>
          </button>
        )}

        <div className="betting-panel__right">
          <div className={`betting-card betting-card--bet ${gameStarted ? 'betting-card--disabled' : ''}`}>
            <span className="betting-card__label">BET</span>
            <div className="betting-card__bet-row">
              <span className="betting-card__currency">
                {(CURRENCY_META as Record<string, { symbol: string }>)[currencyCode]?.symbol ?? currencyCode}
              </span>
              <input
                type="text"
                inputMode="decimal"
                className="betting-card__input"
                value={formatAmountForDisplay(bet, currencyCode)}
                onChange={handleBetChange}
                onBlur={handleBetBlur}
                disabled={gameStarted}
                aria-label="Bet amount"
              />
              <div className="betting-card__arrows">
                <button
                  type="button"
                  className="betting-card__arrow"
                  onClick={handleBetUp}
                  disabled={gameStarted}
                  aria-label="Increase bet"
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="betting-card__arrow"
                  onClick={handleBetDown}
                  disabled={gameStarted}
                  aria-label="Decrease bet"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
