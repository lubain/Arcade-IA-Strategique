import { COLS, EMPTY, ROWS } from "@/domain/constants";

export function dropP4(
  board: number[],
  col: number,
  player: number,
): number[] | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    const idx = r * COLS + col;
    if (board[idx] === EMPTY) {
      const b = [...board];
      b[idx] = player;
      return b;
    }
  }
  return null;
}
