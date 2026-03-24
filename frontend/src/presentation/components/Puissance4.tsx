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

const Puissance4 = () => {
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
      const response = await fetch("http://localhost:8000/puissance4-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board, turn: O }),
      });
      const data = await response.json();

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

  return (
    <div className="p4-container">
      <h2>Puissance 4</h2>

      <div className="status-bar">
        {winner !== EMPTY ? (
          <span className="winner-text">
            Gagnant : {winner === X ? "Rouge" : "Jaune"} !
          </span>
        ) : isBoardFull(board) ? (
          <span>Match nul !</span>
        ) : (
          <span>
            Tour :{" "}
            <span className={turn === X ? "text-red" : "text-yellow"}>
              {turn === X ? "Rouge (Vous)" : "Jaune (IA...)"}
            </span>
          </span>
        )}
      </div>

      <div className="p4-board">
        {board.map((cell, i) => (
          <div key={i} className="p4-cell" onClick={() => handleCellClick(i)}>
            <div className={`p4-slot slot-${cell}`} />
          </div>
        ))}
      </div>

      <button className="reset-btn" onClick={resetGame}>
        Rejouer
      </button>
    </div>
  );
};

export default Puissance4;
