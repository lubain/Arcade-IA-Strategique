import { O, X } from "@/domain/constants";
import ResetBtn from "@/presentation/components/ui/ResetBtn";
import GameStatusBar from "@/presentation/components/GameStatusBar";
import { useTicTacToeGame } from "@/applications/hooks/useTicTacToeGame";

export default function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const { board, thinking, statusLabel, winData, isDraw, handleClick, reset } =
    useTicTacToeGame();

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
        <h2 className="hub-game-title ttt-accent">Tic-Tac-Toe</h2>
        <ResetBtn onClick={reset} />
      </div>

      <GameStatusBar label={statusLabel} />

      <div className="hub-game-surface" style={{ position: "relative" }}>
        <div className={`ttt-grid${thinking ? " is-thinking" : ""}`}>
          {board.map((cell, i) => (
            <button
              key={i}
              className={`ttt-cell${cell === X ? " ttt-x" : cell === O ? " ttt-o" : ""}`}
              onClick={() => handleClick(i)}
              disabled={cell !== 0 || !!winData || isDraw || thinking}
            >
              {cell === X && <span className="ttt-mark x-mark">✕</span>}
              {cell === O && <span className="ttt-mark o-mark">◯</span>}
            </button>
          ))}
        </div>
        {/* {thinking && <ThinkingOverlay text="L'IA réfléchit à son coup…" />} */}
      </div>
    </div>
  );
}
