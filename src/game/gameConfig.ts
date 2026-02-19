/**
 * Lucky Fishy - Game configuration per level
 */

export const LEVELS = [
  { level: 1, bubbles: 5, bombs: 1, multiplier: 1.18 },
  { level: 2, bubbles: 6, bombs: 2, multiplier: 1.48 },
  { level: 3, bubbles: 7, bombs: 3, multiplier: 2.05 },
  { level: 4, bubbles: 8, bombs: 4, multiplier: 3.2 },
  { level: 5, bubbles: 9, bombs: 5, multiplier: 6.3 },
  { level: 6, bubbles: 10, bombs: 6, multiplier: 13.2 },
  { level: 7, bubbles: 10, bombs: 7, multiplier: 32 },
  { level: 8, bubbles: 10, bombs: 8, multiplier: 95 },
  { level: 9, bubbles: 10, bombs: 9, multiplier: 580 },
] as const;

export const MAX_LEVEL = 9;

export function getLevelConfig(level: number) {
  return LEVELS.find((l) => l.level === level) ?? LEVELS[0];
}

export function getBubbleCount(level: number): number {
  return getLevelConfig(level).bubbles;
}

export function getBombCount(level: number): number {
  return getLevelConfig(level).bombs;
}

export function getMultiplier(level: number): number {
  return getLevelConfig(level).multiplier;
}
