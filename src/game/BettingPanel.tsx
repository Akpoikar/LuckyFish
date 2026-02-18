import { useCallback, useState } from 'react';

const DEFAULT_BALANCE = 10000;
const MIN_BET = 1;
const MAX_BET = 10000;

export function BettingPanel() {
  const [balance, setBalance] = useState(DEFAULT_BALANCE);
  const [bet, setBet] = useState(1);

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

  const handlePlay = useCallback(() => {
    if (bet > balance || bet < MIN_BET) return;
    setBalance((b) => b - bet);
    // TODO: Start game round
  }, [bet, balance]);

  const canPlay = bet <= balance && bet >= MIN_BET;

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

        <button
          type="button"
          className="play-button"
          onClick={handlePlay}
          disabled={!canPlay}
          aria-label="Play"
        >
          <span className="play-button__icon" aria-hidden>▶</span>
          {/* <span className="play-button__label">PLAY</span> */}
        </button>

        <div className="betting-panel__right">
          <div className="betting-card betting-card--bet">
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
                aria-label="Bet amount"
              />
              <div className="betting-card__arrows">
                <button
                  type="button"
                  className="betting-card__arrow"
                  onClick={handleBetUp}
                  aria-label="Increase bet"
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="betting-card__arrow"
                  onClick={handleBetDown}
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
