import { useState } from "react";
import { TicTacToeNode, getBestMove, O, X } from "@/game/TicTacToe";

const toSymbol = (value: number): string => {
  if (value === X) return "X";
  if (value === O) return "O";
  return "";
};

const TicTacToe = () => {
  const [game, setGame] = useState(new TicTacToeNode());

  const handleClick = (index: number) => {
    const newGame = game.clone();

    if (newGame.board[index] !== 0 || newGame.isTerminal()) return;

    newGame.play(index);
    if (newGame.isTerminal()) {
      setGame(newGame);
      return;
    }

    // IA joue
    const aiMove = getBestMove(newGame, 9);
    setGame(aiMove);
  };

  const score = game.evaluate(X);
  const winner = score > 0 ? "X" : score < 0 ? "O" : null;
  const isDraw = game.isFull() && !winner;
  const currentTurn = game.turn === X ? "X" : "O";

  let status = `Tour: ${currentTurn}`;
  if (winner) status = `Gagnant: ${winner}`;
  if (isDraw) status = "Match nul";

  return (
    <main className="ttt-page">
      <section className="ttt-card">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <p className="ttt-status">{status}</p>

        <div className="ttt-grid" role="grid" aria-label="Plateau Tic Tac Toe">
          {game.board.map((cell, index) => (
            <button
              key={index}
              type="button"
              className="ttt-cell"
              onClick={() => handleClick(index)}
              disabled={cell !== 0 || game.isTerminal()}
              aria-label={`Case ${index + 1}`}
            >
              <span className={cell === X ? "ttt-x" : "ttt-o"}>
                {toSymbol(cell)}
              </span>
            </button>
          ))}
        </div>

        <button
          className="ttt-reset"
          type="button"
          onClick={() => setGame(new TicTacToeNode())}
        >
          Rejouer
        </button>
      </section>
    </main>
  );
};

export default TicTacToe;
