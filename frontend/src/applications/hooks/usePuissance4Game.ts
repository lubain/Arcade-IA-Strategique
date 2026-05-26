import { checkP4, dropP4 } from "@/applications/utils";
import { COLS, EMPTY, O, ROWS, X } from "@/domain/constants";
import { apiPost } from "@/infrastructure/ApiPost";
import { useCallback, useState } from "react";

export const usePuissance4Game = () => {
  const [board, setBoard] = useState(Array(ROWS * COLS).fill(EMPTY));
  const [turn, setTurn] = useState(X);
  const [winner, setWinner] = useState(EMPTY);
  const [thinking, setThinking] = useState(false);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const isFull = board.slice(0, COLS).every((c) => c !== EMPTY);

  const fetchAI = useCallback(async (b: number[]) => {
    setThinking(true);
    try {
      const d = await apiPost("/puissance4-move", { board: b, turn: O });
      setBoard(d.best_board);
      const w = checkP4(d.best_board);
      if (w !== EMPTY) setWinner(w);
      else setTurn(X);
    } catch {
      setTurn(X);
    } finally {
      setThinking(false);
    }
  }, []);

  const handleColClick = (col: number) => {
    if (turn !== X || winner !== EMPTY || thinking || isFull) return;
    const nb = dropP4(board, col, X);
    if (!nb) return;
    setBoard(nb);
    const w = checkP4(nb);
    if (w !== EMPTY) {
      setWinner(w);
      return;
    }
    if (nb.slice(0, COLS).every((c) => c !== EMPTY)) return;
    setTurn(O);
    fetchAI(nb);
  };

  const reset = () => {
    setBoard(Array(ROWS * COLS).fill(EMPTY));
    setTurn(X);
    setWinner(EMPTY);
  };

  const statusLabel =
    winner !== EMPTY
      ? `${winner === X ? "🔴 Rouge" : "🟡 Jaune (IA)"} gagne !`
      : isFull && winner === EMPTY
        ? "Match nul !"
        : thinking
          ? "L'IA cherche la colonne…"
          : turn === X
            ? "Votre tour — Rouge"
            : "Tour de l'IA — Jaune";
  return {
    board,
    turn,
    winner,
    thinking,
    hoverCol,
    statusLabel,
    setHoverCol,
    handleColClick,
    reset,
  };
};
