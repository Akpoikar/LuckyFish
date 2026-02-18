import { useCallback } from 'react';

export const LEVELS = [
  { level: 1, multiplier: 1.18 },
  { level: 2, multiplier: 1.5 },
  { level: 3, multiplier: 2.21 },
  { level: 4, multiplier: 3.25 },
  { level: 5, multiplier: 6.4 },
  { level: 6, multiplier: 13.5 },
  { level: 7, multiplier: 30 },
  { level: 8, multiplier: 70 },
  { level: 9, multiplier: 155 },
  { level: 10, multiplier: 320 },
];

const VISIBLE_COUNT = 5;

function formatMultiplier(value: number): string {
  return `${value}x`;
}

interface MultiplierLevelsProps {
  value: number;
  onChange: (level: number) => void;
}

export function MultiplierLevels({ value: activeLevel, onChange }: MultiplierLevelsProps) {
  const handleLevelClick = useCallback(
    (level: number) => {
      onChange(level);
    },
    [onChange]
  );

  const startIndex = Math.max(0, Math.min(activeLevel - 1, LEVELS.length - VISIBLE_COUNT));
  const itemWidth = 64;
  const gap = 8;
  const translatePx = startIndex * (itemWidth + gap);

  return (
    <div className="multiplier-levels">
      <div className="multiplier-levels__container">
        <div className="multiplier-levels__viewport">
          <div
            className="multiplier-levels__track"
            style={{ transform: `translateX(-${translatePx}px)` }}
          >
            {LEVELS.map(({ level, multiplier }) => (
              <button
                key={level}
                type="button"
                className={`multiplier-levels__item ${activeLevel === level ? 'multiplier-levels__item--active' : ''}`}
                onClick={() => handleLevelClick(level)}
              >
                <span className="multiplier-levels__label">Lvl {level}</span>
                <span className="multiplier-levels__value">{formatMultiplier(multiplier)}</span>
              </button>
            ))}
          </div>
        </div>
      
      </div>
    </div>
  );
}
