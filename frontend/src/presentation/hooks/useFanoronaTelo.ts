import { useState, useMemo } from "react";
import {
  X,
  O,
  checkWinner,
  isPlacementPhase,
  getSuccessors,
} from "@/presentation/shared/utils/fanoronaUtils";
import "@/presentation/styles/fanorona.css";
import { GetBestMoveIa } from "@/game/api";

const best = new GetBestMoveIa();

export const useFanoronaTelo = () => {
  const [gameState, setGameState] = useState({
    board: Array(9).fill(0),
    turn: X as number,
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const { board, turn } = gameState;
  const placementMode = isPlacementPhase(board);
  const winner = checkWinner(board);

  // On calcule les coups valides pour vérifier le clic de l'utilisateur
  const validMoves = useMemo(() => getSuccessors(board, turn), [board, turn]);

  const playMove = async (nextBoard: number[]) => {
    const nextTurn = turn === X ? O : X;
    setGameState({ board: nextBoard, turn: nextTurn });

    if (checkWinner(nextBoard) !== 0 || isThinking) return;

    setIsThinking(true);
    try {
      const data = await best.bestMoveFanorona(nextBoard, nextTurn);
      if (!data) {
        throw new Error("API error: empty response");
      }
      setGameState({ board: data.best_board, turn: data.next_turn });
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClick = (index: number) => {
    if (winner !== 0 || turn !== X || isThinking) return;

    if (placementMode) {
      if (board[index] !== 0) return;
      const move = validMoves.find((m) => m[index] === X);
      if (move) playMove(move);
    } else {
      if (selected === null) {
        if (board[index] === X) setSelected(index);
      } else {
        if (board[index] === X) {
          setSelected(index); // Change de pion sélectionné
        } else {
          // Tente un déplacement du pion 'selected' vers 'index'
          const move = validMoves.find(
            (m) => m[selected] === 0 && m[index] === X
          );
          setSelected(null);
          if (move) playMove(move);
        }
      }
    }
  };
  return {
    placementMode,
    board,
    selected,
    setGameState,
    handleClick,
  };
};
