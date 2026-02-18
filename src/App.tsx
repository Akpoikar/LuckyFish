import { useEffect, useRef, useState } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { BettingPanel } from '@/game/BettingPanel';
import { MultiplierLevels } from '@/game/MultiplierLevels';
import { BubbleRing } from '@/game/BubbleRing';

export function App() {
  const [round, setRound] = useState(1);
  const [centerSize, setCenterSize] = useState(360);
  const centerRef = useRef<HTMLDivElement>(null);

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
          <BubbleRing
            key={round}
            round={round}
            containerSize={centerSize}
            onBubbleClick={() => setRound((r) => Math.min(r + 1, 10))}
          />
          <img
            src="/images/fish.png"
            alt="Lucky Fish"
            className="game-logo"
          />
        </div>
        <div className="game-bomb-badge">
          <span className="game-bomb-badge__icon">💣</span>
          <span className="game-bomb-badge__count">
            {round} {round === 1 ? 'bomb' : 'bombs'}
          </span>
        </div>
      </main>
      <BettingPanel />
    </GameLayout>
  );
}
