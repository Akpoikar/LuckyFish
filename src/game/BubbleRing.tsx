import { useEffect, useMemo, useState } from 'react';
import { getBubbleCount } from './gameConfig';

/** Animation gets faster per level: level 1 = slowest, level 9 = fastest */
function getAnimationTiming(level: number) {
  const duration = 0.25 - (0.1 / 8) * (level - 1); // 0.25s → 0.15s
  const delayStep = 0.1 - (0.05 / 8) * (level - 1); // 0.1s → 0.05s
  return { duration, delayStep };
}

const DESIGN_SIZE = 360;

interface BubbleRingProps {
  round?: number;
  containerSize?: number;
  onBubbleClick?: () => void;
}

export function BubbleRing({ round = 1, containerSize = DESIGN_SIZE, onBubbleClick }: BubbleRingProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const bubbleCount = useMemo(() => getBubbleCount(round), [round]);
  const { duration, delayStep } = useMemo(() => getAnimationTiming(round), [round]);

  const bubbles = useMemo(() => {
    const visibleRows = bubbleCount;
    const baseRadius = 130 + Math.max(0, Math.min(visibleRows - 6, 9)) * 5;
    const scale = containerSize / DESIGN_SIZE;
    const radius = baseRadius * scale;

    return Array.from({ length: visibleRows }, (_, rowIndex) => {
      const angleDeg = (360 / visibleRows) * rowIndex - 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Math.cos(angleRad) * radius;
      const y = Math.sin(angleRad) * radius;
      return { x, y, rowIndex };
    });
  }, [bubbleCount, containerSize]);

  const totalAnimationMs = (bubbleCount - 1) * delayStep * 1000 + duration * 1000;

  useEffect(() => {
    setAnimationComplete(false);
    const t = setTimeout(() => setAnimationComplete(true), totalAnimationMs);
    return () => clearTimeout(t);
  }, [round, totalAnimationMs]);

  const canClick = animationComplete && onBubbleClick;
  const scale = containerSize / DESIGN_SIZE;

  return (
    <div
      className={`bubble-ring ${!animationComplete ? 'bubble-ring--animating' : ''}`}
      style={
        {
          '--bubble-duration': `${duration}s`,
          '--bubble-delay-step': `${delayStep}s`,
          '--bubble-scale': scale,
        } as React.CSSProperties
      }
    >
      {bubbles.map(({ x, y, rowIndex }) => (
        <div
          key={rowIndex}
          className="bubble-ring__bubble"
          role="button"
          tabIndex={canClick ? 0 : -1}
          onClick={canClick ? onBubbleClick : undefined}
          onKeyDown={canClick ? (e) => e.key === 'Enter' && onBubbleClick?.() : undefined}
          style={{
            '--bubble-x': `${x}px`,
            '--bubble-y': `${y}px`,
            '--bubble-delay': `${rowIndex * delayStep}s`,
          } as React.CSSProperties}
        >
          <div className="bubble-ring__glass" />
          <div
            className="bubble-ring__worm"
            style={{ animationDelay: `${rowIndex * delayStep}s` }}
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
