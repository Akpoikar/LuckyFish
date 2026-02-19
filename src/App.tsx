import { useCallback, useEffect, useRef, useState } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { BettingPanel } from '@/game/BettingPanel';
import { MultiplierLevels } from '@/game/MultiplierLevels';
import { BubbleRing } from '@/game/BubbleRing';
import { getBombCount, MAX_LEVEL } from '@/game/gameConfig';

export function App() {
  const [round, setRound] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [centerSize, setCenterSize] = useState(360);
  const centerRef = useRef<HTMLDivElement>(null);
  const startGameRef = useRef<() => void>(() => {});

  const handleStartRequest = useCallback((start: () => void) => {
    startGameRef.current = start;
  }, []);

  const handleGameEnd = useCallback(() => {
    setGameStarted(false);
    setRound(1);
  }, []);

  useEffect(() => {
    const el = centerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width } = entries[0]?.contentRect ?? {};
      if (typeof width === 'number') setCenterSize(width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <GameLayout>
      <MultiplierLevels value={round} onChange={setRound} />
      <main className="game-main">
        <div ref={centerRef} className="game-main__center">
          {!gameStarted && (
            <div className="game-hint-badge">
              Tap on a fish or play button to start
            </div>
          )}
          {gameStarted && (
            <BubbleRing
              key={round}
              round={round}
              containerSize={centerSize}
              onBubbleClick={() => setRound((r) => Math.min(r + 1, MAX_LEVEL))}
            />
          )}
          <img
            src="/images/fish.png"
            alt="Lucky Fish"
            className={`game-logo ${!gameStarted ? 'game-logo--tappable' : ''}`}
            role={!gameStarted ? 'button' : undefined}
            tabIndex={!gameStarted ? 0 : undefined}
            onClick={!gameStarted ? () => startGameRef.current() : undefined}
            onKeyDown={!gameStarted ? (e) => e.key === 'Enter' && startGameRef.current() : undefined}
          />
        </div>
        {gameStarted && (
          <div className="game-bomb-badge">
            <span className="game-bomb-badge__icon">💣</span>
            <span className="game-bomb-badge__count">
              {getBombCount(round)} {getBombCount(round) === 1 ? 'bomb' : 'bombs'}
            </span>
          </div>
        )}
      </main>
      <BettingPanel
        round={round}
        gameStarted={gameStarted}
        onGameStart={() => setGameStarted(true)}
        onGameEnd={handleGameEnd}
        onStartRequest={handleStartRequest}
      />
    </GameLayout>
  );
}
