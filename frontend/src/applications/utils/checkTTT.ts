import { TTT_LINES } from "@/domain/constants";

export function checkTTT(b: number[]) {
  for (const {
    idx: [a, c, d],
    cls,
  } of TTT_LINES)
    if (b[a] !== 0 && b[a] === b[c] && b[c] === b[d])
      return { winner: b[a], cls };
  return null;
}
