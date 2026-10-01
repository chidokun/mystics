import { randomInt, shuffle } from '../../../lib/random';

export { randomInt, shuffle };

const DECK = Array.from({ length: 36 }, (_, i) => i + 1);

/** Xào bộ 36 lá rồi rút `count` lá từ trên xuống. */
export function drawCards(count: number, rand?: (max: number) => number): number[] {
  return shuffle(DECK, rand).slice(0, count);
}
