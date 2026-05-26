import { COLS, EMPTY, ROWS } from "@/domain/constants";

export function checkP4(board: number[]): number {
  const at = (r: number, c: number) => board[r * COLS + c];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++) {
      const p = at(r, c);
      if (p && p === at(r, c + 1) && p === at(r, c + 2) && p === at(r, c + 3))
        return p;
    }
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS; c++) {
      const p = at(r, c);
      if (p && p === at(r + 1, c) && p === at(r + 2, c) && p === at(r + 3, c))
        return p;
    }
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++) {
      const p = at(r, c);
      if (
        p &&
        p === at(r + 1, c + 1) &&
        p === at(r + 2, c + 2) &&
        p === at(r + 3, c + 3)
      )
        return p;
    }
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++) {
      const p = at(r, c);
      if (
        p &&
        p === at(r - 1, c + 1) &&
        p === at(r - 2, c + 2) &&
        p === at(r - 3, c + 3)
      )
        return p;
    }
  return EMPTY;
}
