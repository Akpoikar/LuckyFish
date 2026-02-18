import type { ReactNode } from 'react';
import { BubbleBackground } from '@/components/bubble-background';
import { GameMenu } from '@/components/GameMenu';

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <div className="game-layout">
      <div className="game-bg" aria-hidden />
      <BubbleBackground />
      <div className="game-content">
        <GameMenu />
        {children}
      </div>
    </div>
  );
}
