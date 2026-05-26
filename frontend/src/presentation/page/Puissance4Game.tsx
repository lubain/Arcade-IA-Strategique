import { COLS, EMPTY, O, X } from "@/domain/constants";
import ResetBtn from "@/presentation/components/ui/ResetBtn";
import GameStatusBar from "@/presentation/components/GameStatusBar";
import { usePuissance4Game } from "@/applications/hooks/usePuissance4Game";

export default function Puissance4Game({ onBack }: { onBack: () => void }) {
  const {
    board,
    turn,
    winner,
    thinking,
    hoverCol,
    statusLabel,
    setHoverCol,
    handleColClick,
    reset,
  } = usePuissance4Game();

  return (
    <div className="hub-game-wrap">
      <div className="hub-game-header">
        <button className="hub-back-btn" onClick={onBack}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Hub
        </button>
        <h2 className="hub-game-title p4-accent">Puissance 4</h2>
        <ResetBtn onClick={reset} />
      </div>

      <GameStatusBar label={statusLabel} />

      <div className="hub-game-surface" style={{ position: "relative" }}>
        {/* Column click targets */}
        <div className="p4-col-targets">
          {Array.from({ length: COLS }).map((_, c) => (
            <button
              key={c}
              className={`p4-col-btn${hoverCol === c ? " active" : ""}`}
              onClick={() => handleColClick(c)}
              onMouseEnter={() => setHoverCol(c)}
              onMouseLeave={() => setHoverCol(null)}
              disabled={thinking || winner !== EMPTY}
            />
          ))}
        </div>

        <div className={`p4-board${thinking ? " is-thinking" : ""}`}>
          {board.map((cell, i) => {
            const col = i % COLS;
            return (
              <div
                key={i}
                className={`p4-cell${hoverCol === col && turn === X && winner === EMPTY && !thinking ? " col-hover" : ""}`}
              >
                <div
                  className={`p4-disc${cell === X ? " disc-x" : cell === O ? " disc-o" : ""}`}
                />
              </div>
            );
          })}
        </div>
        {/* {thinking && <ThinkingOverlay text="L'IA évalue les colonnes…" />} */}
      </div>
    </div>
  );
}
