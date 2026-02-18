import { useMemo } from 'react';

/**
 * Bubble count per round: round 1 = 5, round 2 = 6, ... round 10 = 15
 */
function getBubbleCount(round: number): number {
  return Math.round(5 + ((15 - 5) / 9) * (round - 1));
}

interface BubbleRingProps {
  round?: number;
  onBubbleClick?: () => void;
}

export function BubbleRing({ round = 1, onBubbleClick }: BubbleRingProps) {
  const bubbleCount = useMemo(() => getBubbleCount(round), [round]);

  const bubbles = useMemo(() => {
    const visibleRows = bubbleCount;
    const radius = 130 + Math.max(0, Math.min(visibleRows - 6, 9)) * 5;

    return Array.from({ length: visibleRows }, (_, rowIndex) => {
      const angleDeg = (360 / visibleRows) * rowIndex - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Math.cos(angleRad) * radius;
      const y = Math.sin(angleRad) * radius;
      return { x, y, rowIndex };
    });
  }, [bubbleCount]);

  return (
    <div className="bubble-ring">
      {bubbles.map(({ x, y, rowIndex }) => (
        <div
          key={rowIndex}
          className="bubble-ring__bubble"
          role="button"
          tabIndex={0}
          onClick={onBubbleClick}
          onKeyDown={(e) => e.key === 'Enter' && onBubbleClick?.()}
          style={{
            '--bubble-x': `${x}px`,
            '--bubble-y': `${y}px`,
            '--bubble-delay': `${rowIndex * 0.2}s`,
          } as React.CSSProperties}
        >
          <div className="bubble-ring__glass" />
          <div
            className="bubble-ring__worm"
            style={{ animationDelay: `${rowIndex * 0.2}s` }}
          >
            <img
              src="/images/worm.png"
              alt=""
              className="bubble-ring__worm-img"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
