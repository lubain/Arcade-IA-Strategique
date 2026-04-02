import { useState, useEffect } from "react";
import {
  playDrop,
  checkWinner,
  isBoardFull,
  ROWS,
  COLS,
  X,
  O,
  EMPTY,
} from "@/game/puissance4Utils";
import "@/presentation/styles/p4.css";
import { GetBestMoveIa } from "@/game/api";

const best = new GetBestMoveIa();

export const usePuissance4 = () => {
  const [board, setBoard] = useState<number[]>(Array(ROWS * COLS).fill(EMPTY));
  const [turn, setTurn] = useState<number>(X); // X commence (Humain)
  const [winner, setWinner] = useState<number>(EMPTY);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // --- TOUR DE L'IA ---
  useEffect(() => {
    if (turn === O && winner === EMPTY && !isBoardFull(board)) {
      fetchAiMove();
    }
  }, [turn, winner, board]);

  const fetchAiMove = async () => {
    setIsAiThinking(true);
    try {
      const data = await best.bestMovePuissance4(board);
      if (!data) {
        throw new Error("API error: empty response");
      }

      setBoard(data.best_board);
      const win = checkWinner(data.best_board);
      if (win !== EMPTY) setWinner(win);
      setTurn(X);
    } catch (error) {
      console.error("Erreur IA:", error);
    } finally {
      setIsAiThinking(false);
    }
  };

  // --- CLIC HUMAIN ---
  const handleCellClick = (index: number) => {
    if (turn !== X || winner !== EMPTY || isAiThinking) return;

    const col = index % COLS;
    const nextBoard = playDrop(board, col, X);

    if (nextBoard) {
      setBoard(nextBoard);
      const win = checkWinner(nextBoard);
      if (win !== EMPTY) {
        setWinner(win);
      } else {
        setTurn(O);
      }
    }
  };
  const resetGame = () => {
    setBoard(Array(ROWS * COLS).fill(EMPTY));
    setTurn(X);
    setWinner(EMPTY);
  };
  return {
    winner,
    board,
    turn,
    resetGame,
    handleCellClick,
  };
};
