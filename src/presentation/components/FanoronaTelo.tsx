import { useMemo, useState } from "react";
import { FanoronaTeloNode, getBestMove, O, X } from "@/game/FanoronaTelo";

const toSymbol = (value: number): string => {
  if (value === X) return "X";
  if (value === O) return "O";
  return "";
};

const isPlacementMove = (
  prevBoard: number[],
  nextBoard: number[],
  index: number,
  player: number
): boolean => {
  if (prevBoard[index] !== 0) return false;
  if (nextBoard[index] !== player) return false;

  for (let i = 0; i < prevBoard.length; i++) {
    if (i === index) continue;
    if (prevBoard[i] !== nextBoard[i]) return false;
  }

  return true;
};

const isMoveFromTo = (
  prevBoard: number[],
  nextBoard: number[],
  from: number,
  to: number,
  player: number
): boolean => {
  if (prevBoard[from] !== player) return false;
  if (nextBoard[to] !== player) return false;
  if (nextBoard[from] !== 0) return false;
  return true;
};

const FanoronaTelo = () => {
  const [game, setGame] = useState(new FanoronaTeloNode());
  const [selected, setSelected] = useState<number | null>(null);

  const humanPlayer = X;
  const placementPhase = game.isPlacementPhase();

  const successors = useMemo(() => game.getSuccessors(), [game]);

  const playAiIfNeeded = (nextNode: FanoronaTeloNode) => {
    if (nextNode.isTerminal()) {
      setGame(nextNode);
      return;
    }

    const aiMove = getBestMove(nextNode, 6);
    setGame(aiMove);
  };

  const handleClick = (index: number) => {
    if (game.isTerminal()) return;
    if (game.turn !== humanPlayer) return;

    if (placementPhase) {
      if (game.board[index] !== 0) return;
      const nextNode =
        successors.find((child) =>
          isPlacementMove(game.board, child.board, index, humanPlayer)
        ) ?? null;

      if (!nextNode) return;
      playAiIfNeeded(nextNode);
      return;
    }

    if (selected === null) {
      if (game.board[index] === humanPlayer) {
        setSelected(index);
      }
      return;
    }

    if (game.board[index] === humanPlayer) {
      setSelected(index);
      return;
    }

    const nextNode =
      successors.find((child) =>
        isMoveFromTo(game.board, child.board, selected, index, humanPlayer)
      ) ?? null;

    setSelected(null);
    if (!nextNode) return;
    playAiIfNeeded(nextNode);
  };

  const winner = game.getWinner();
  const currentTurn = game.turn === X ? "X" : "O";

  let status = `Tour: ${currentTurn}`;
  if (winner) status = `Gagnant: ${winner === X ? "X" : "O"}`;
  if (!winner && game.isTerminal()) status = "Match nul";

  return (
    <main className="ttt-page">
      <section className="ttt-card">
        <h1 className="ttt-title">Fanoro Telo</h1>
        <p className="ttt-status">
          {status} {placementPhase ? "(placement)" : "(déplacement)"}
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
            {game.board.map((cell, index) => {
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
                  disabled={game.isTerminal()}
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
          onClick={() => {
            setGame(new FanoronaTeloNode());
            setSelected(null);
          }}
        >
          Rejouer
        </button>
      </section>
    </main>
  );
};

export default FanoronaTelo;
