import { useState } from "react";
import { checkWinner, isFull, O, X } from "../shared/utils/gameUtils";
import "@/presentation/styles/ttt.css";
import { GetBestMoveIa } from "@/game/api";

const best = new GetBestMoveIa();

export const useTicTacToe = () => {
  // On utilise un objet simple au lieu de 'new TicTacToeNode()'
  const [gameState, setGameState] = useState({
    board: Array(9).fill(0),
    turn: X as number,
  });
  const [isThinking, setIsThinking] = useState(false);

  const handleClick = async (index: number) => {
    const { board, turn } = gameState;
    const isPlayerTurn = turn === X;

    // Vérifications de base (remplace isTerminal)
    if (
      board[index] !== 0 ||
      checkWinner(board) ||
      isFull(board) ||
      isThinking ||
      !isPlayerTurn
    )
      return;

    // 1. Joueur humain joue
    const newBoard = [...board];
    newBoard[index] = turn;
    const nextTurn = turn === X ? O : X;

    setGameState({ board: newBoard, turn: nextTurn });

    // Si le joueur a gagné ou match nul, on arrête
    if (checkWinner(newBoard) || isFull(newBoard)) return;

    // 2. Appel API pour l'IA
    setIsThinking(true);
    try {
      const data = await best.bestMoveTicTacToe(newBoard, nextTurn);
      if (!data) {
        throw new Error("API error: empty response");
      }
      console.log("Best move from API:", data);

      // On met directement à jour avec les données brutes de l'API
      setGameState({ board: data.best_board, turn: data.next_turn });
    } catch (e) {
      console.error(e);
      // On rend la main au joueur si l'IA échoue
      setGameState({ board: newBoard, turn: X });
    } finally {
      setIsThinking(false);
    }
  };
  return {
    handleClick,
    gameState,
    isThinking,
    setGameState,
  };
};
