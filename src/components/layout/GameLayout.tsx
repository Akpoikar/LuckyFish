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
        <nav className="game-navbar">
          <h1 className="game-navbar__title">Lucky Fishy</h1>
          <GameMenu />
        </nav>
        {children}
      </div>
    </div>
  );
}
