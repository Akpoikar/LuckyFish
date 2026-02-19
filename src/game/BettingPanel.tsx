import { useCallback, useEffect, useRef, useState } from 'react';
import { getMultiplier } from '@/game/gameConfig';

const DEFAULT_BALANCE = 10000;
const MIN_BET = 1;
const MAX_BET = 10000;

interface BettingPanelProps {
  round?: number;
  gameStarted?: boolean;
  onGameStart?: () => void;
  onGameEnd?: () => void;
  onStartRequest?: (start: () => void) => void;
}

export function BettingPanel({
  round = 1,
  gameStarted = false,
  onGameStart,
  onGameEnd,
  onStartRequest,
}: BettingPanelProps) {
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [bet, setBet] = useState(1);
  const prevGameStartedRef = useRef(gameStarted);

  const clampBet = useCallback((value: number) => {
    return Math.max(MIN_BET, Math.min(MAX_BET, Math.round(value)));
  }, []);

  const handleBetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, '');
      if (raw === '') {
        setBet(MIN_BET);
        return;
      }
      const num = parseInt(raw, 10);
      if (!isNaN(num)) setBet(clampBet(num));
    },
    [clampBet]
  );

  const handleBetBlur = useCallback(() => {
    setBet((b) => clampBet(b));
  }, [clampBet]);

  const handleBetUp = useCallback(() => {
    setBet((b) => clampBet(b * 2));
  }, [clampBet]);

  const handleBetDown = useCallback(() => {
    setBet((b) => clampBet(b / 2));
  }, [clampBet]);

  useEffect(() => {
    if (gameStarted && !prevGameStartedRef.current) {
      setBalance((b) => (b >= bet ? b - bet : b));
    }
    prevGameStartedRef.current = gameStarted;
  }, [gameStarted, bet]);

  const handlePlay = useCallback(() => {
    if (bet > balance || bet < MIN_BET) return;
    onGameStart?.();
  }, [bet, balance, onGameStart]);

  useEffect(() => {
    onStartRequest?.(handlePlay);
  }, [handlePlay, onStartRequest]);

  const handleCashOut = useCallback(() => {
    const multiplier = getMultiplier(round);
    const payout = bet * multiplier;
    setBalance((b) => b + payout);
    onGameEnd?.();
  }, [round, bet, onGameEnd]);

  const canPlay = !gameStarted && bet <= balance && bet >= MIN_BET;
  const showCashOut = gameStarted && round > 1;
  const cashOutAmount = showCashOut ? bet * getMultiplier(round) : 0;

  return (
    <div className="betting-panel">
      <div className="betting-panel__row">
        <div className="betting-panel__left">
          <div className="betting-card betting-card--balance">
            <span className="betting-card__label">BALANCE</span>
            <span className="betting-card__value">
              <span className="betting-card__currency">$</span>
              {balance.toLocaleString()}
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
              ${cashOutAmount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
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
              <span className="betting-card__currency">$</span>
              <input
                type="text"
                inputMode="numeric"
                className="betting-card__input"
                value={bet}
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
