import { useState } from 'react';
import { GameLayout } from '@/components/layout/GameLayout';
import { BettingPanel } from '@/game/BettingPanel';
import { MultiplierLevels } from '@/game/MultiplierLevels';
import { BubbleRing } from '@/game/BubbleRing';

export function App() {
  const [round, setRound] = useState(1);

  return (
    <GameLayout>
      <MultiplierLevels value={round} onChange={setRound} />
      <main className="game-main">
        <div className="game-main__center">
          <BubbleRing
            key={round}
            round={round}
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
