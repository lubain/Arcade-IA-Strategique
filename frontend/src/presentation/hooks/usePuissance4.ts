import { useEffect, useState } from "react";
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
import { useDelayedThinking } from "./useDelayedThinking";

const best = new GetBestMoveIa();

export const usePuissance4 = () => {
  const [board, setBoard] = useState<number[]>(Array(ROWS * COLS).fill(EMPTY));
  const [turn, setTurn] = useState<number>(X);
  const [winner, setWinner] = useState<number>(EMPTY);
  const {
    isThinking: isAiThinking,
    beginThinking,
    stopThinking,
  } = useDelayedThinking();

  useEffect(() => {
    if (turn === O && winner === EMPTY && !isBoardFull(board)) {
      fetchAiMove();
    }
  }, [turn, winner, board]);

  const fetchAiMove = async () => {
    beginThinking();

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
      stopThinking();
    }
  };

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
    stopThinking();
  };

  return {
    winner,
    board,
    turn,
    isThinking: isAiThinking,
    resetGame,
    handleCellClick,
  };
};
