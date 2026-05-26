import { checkTTT } from "@/applications/utils";
import { O, X } from "@/domain/constants";
import { apiPost } from "@/infrastructure/ApiPost";
import { useState } from "react";

export const useTicTacToeGame = () => {
  const [board, setBoard] = useState(Array(9).fill(0));
  const [turn, setTurn] = useState(X);
  const [thinking, setThinking] = useState(false);

  const winData = checkTTT(board);
  const isDraw = !winData && board.every((c) => c !== 0);

  const handleClick = async (i: number) => {
    if (board[i] !== 0 || winData || isDraw || thinking || turn !== X) return;
    const nb = [...board];
    nb[i] = X;
    setBoard(nb);
    if (checkTTT(nb) || nb.every((c) => c !== 0)) return;
    setTurn(O);
    setThinking(true);
    try {
      const d = await apiPost("/best-move", { board: nb, turn: O });
      setBoard(d.best_board);
      setTurn(d.next_turn);
    } catch {
      setTurn(X);
    } finally {
      setThinking(false);
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(0));
    setTurn(X);
  };

  const statusLabel = winData
    ? `${winData.winner === X ? "❌ X" : "⭕ O"} remporte la partie !`
    : isDraw
      ? "Match nul !"
      : thinking
        ? "L'IA calcule…"
        : turn === X
          ? "Votre tour (X)"
          : "Tour de l'IA (O)";
  return {
    board,
    thinking,
    statusLabel,
    winData,
    isDraw,
    handleClick,
    reset,
  };
};
