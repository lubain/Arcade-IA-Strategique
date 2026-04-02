import { O, X } from "@/game/FanoronaTelo";
import { useFanoronaTelo } from "../hooks/useFanoronaTelo";
import "@/presentation/styles/fanorona.css";

const toSymbol = (value: number): string => {
  if (value === X) return "X";
  if (value === O) return "O";
  return "";
};

const FanoronaTelo = () => {
  const { placementMode, board, selected, setGameState, handleClick } =
    useFanoronaTelo();

  return (
    <main className="ttt-page">
      <section className="ttt-card">
        <h1 className="ttt-title">Fanoro Telo</h1>
        <p className="ttt-status">
          {status} {placementMode ? "(placement)" : "(déplacement)"}
        </p>

        <div
          className="fanorona-board"
          role="grid"
          aria-label="Plateau Fanoro Telo"
        >
          <svg
            className="fanorona-lines"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <rect x="0" y="0" width="100" height="100" rx="0" />
            <line x1="50" y1="0" x2="50" y2="100" />
            <line x1="0" y1="50" x2="100" y2="50" />
            <line x1="0" y1="0" x2="100" y2="100" />
            <line x1="100" y1="0" x2="0" y2="100" />
          </svg>

          <div className="fanorona-points">
            {board.map((cell, index) => {
              const row = Math.floor(index / 3);
              const col = index % 3;
              const top = row * 50;
              const left = col * 50;

              return (
                <button
                  key={index}
                  type="button"
                  className="fanorona-point"
                  style={{ top: `${top}%`, left: `${left}%` }}
                  onClick={() => handleClick(index)}
                  // disabled={game.isTerminal()}
                  aria-label={`Case ${index + 1}`}
                >
                  <span
                    className={[
                      "fanorona-piece",
                      cell === X ? "is-x" : "",
                      cell === O ? "is-o" : "",
                      selected === index ? "is-selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {toSymbol(cell)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          className="ttt-reset"
          type="button"
          onClick={() => setGameState({ board: Array(9).fill(0), turn: X })}
        >
          Rejouer
        </button>
      </section>
    </main>
  );
};

export default FanoronaTelo;
