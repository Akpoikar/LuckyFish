import { useCallback } from 'react';
import { LEVELS } from './gameConfig';

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
                className={`multiplier-levels__item ${activeLevel === level ? 'multiplier-levels__item--active' : ''} ${level >= 6 ? 'multiplier-levels__item--hard' : ''}`}
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
