import { isBoardFull, X, EMPTY } from "@/game/puissance4Utils";
import "@/presentation/styles/p4.css";
import { usePuissance4 } from "../hooks/usePuissance4";

const Puissance4 = () => {
  const { winner, board, turn, resetGame, handleCellClick } = usePuissance4();
  return (
    <main className="ttt-page">
      <section>
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
      </section>
    </main>
  );
};

export default Puissance4;
