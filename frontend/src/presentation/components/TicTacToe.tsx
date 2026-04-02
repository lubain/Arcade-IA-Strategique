import { checkWinner, isFull, O, X } from "../shared/utils/gameUtils";
import "@/presentation/styles/ttt.css";
import { useTicTacToe } from "../hooks/useTicTacToe";

const TicTacToe = () => {
  const { handleClick, gameState, isThinking, setGameState } = useTicTacToe();

  // Logique d'affichage
  const winData = checkWinner(gameState.board);
  const winner = winData?.winner;
  const winType = winData?.line;

  const draw = !winner && isFull(gameState.board);
  const status = winner
    ? `Gagnant: ${winner === X ? "X" : "O"}`
    : draw
    ? "Match nul"
    : `Tour: ${gameState.turn === X ? "X" : "O"}`;

  return (
    <main className="ttt-page">
      <section className="ttt-card">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <p className="ttt-status">{status}</p>

        <div className="ttt-board">
          <div className="ttt-grid">
            {gameState.board.map((cell, i) => (
              <button
                key={i}
                className="ttt-cell"
                onClick={() => handleClick(i)}
                disabled={cell !== 0 || !!winner || isThinking}
              >
                {cell === X && <span className="ttt-x">X</span>}
                {cell === O && <span className="ttt-o">O</span>}
              </button>
            ))}
          </div>
          {/* On affiche la ligne seulement s'il y a un gagnant */}
          {winType && <div className={`win-line ${winType}`} />}
        </div>

        <button
          className="ttt-reset"
          onClick={() => setGameState({ board: Array(9).fill(0), turn: X })}
        >
          Rejouer
        </button>
      </section>
    </main>
  );
};

export default TicTacToe;
