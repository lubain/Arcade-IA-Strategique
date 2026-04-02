import { useState } from "react";
import { checkWinner, isFull, O, X } from "../shared/utils/gameUtils";
import "@/presentation/styles/ttt.css";
import { GetBestMoveIa } from "@/game/api";
import { useDelayedThinking } from "./useDelayedThinking";

const best = new GetBestMoveIa();

export const useTicTacToe = () => {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(0),
    turn: X as number,
  });
  const { isThinking, beginThinking, stopThinking } = useDelayedThinking();

  const handleClick = async (index: number) => {
    const { board, turn } = gameState;
    const isPlayerTurn = turn === X;

    if (
      board[index] !== 0 ||
      checkWinner(board) ||
      isFull(board) ||
      isThinking ||
      !isPlayerTurn
    )
      return;

    const newBoard = [...board];
    newBoard[index] = turn;
    const nextTurn = turn === X ? O : X;

    setGameState({ board: newBoard, turn: nextTurn });

    if (checkWinner(newBoard) || isFull(newBoard)) return;

    beginThinking();

    try {
      const data = await best.bestMoveTicTacToe(newBoard, nextTurn);
      if (!data) {
        throw new Error("API error: empty response");
      }
      setGameState({ board: data.best_board, turn: data.next_turn });
    } catch (e) {
      console.error(e);
      setGameState({ board: newBoard, turn: X });
    } finally {
      stopThinking();
    }
  };

  return {
    handleClick,
    gameState,
    isThinking,
    setGameState,
  };
};
