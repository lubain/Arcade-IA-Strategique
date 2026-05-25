import { useState, useCallback } from "react";

// ─── Types & Constants ─────────────────────────────────────────────
type GameType = "tictactoe" | "fanorona" | "puissance4" | null;
const X = 1,
  O = -1,
  EMPTY = 0;
const ROWS = 6,
  COLS = 7;
const API = (import.meta as any).env?.VITE_API_URL || "/api";

// ─── API ───────────────────────────────────────────────────────────
async function apiPost(endpoint: string, body: object) {
  const r = await fetch(`${API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`API ${r.status}`);
  return r.json();
}

// ─── Game Utilities ────────────────────────────────────────────────
const TTT_LINES = [
  { idx: [0, 1, 2], cls: "h-1" },
  { idx: [3, 4, 5], cls: "h-2" },
  { idx: [6, 7, 8], cls: "h-3" },
  { idx: [0, 3, 6], cls: "v-1" },
  { idx: [1, 4, 7], cls: "v-2" },
  { idx: [2, 5, 8], cls: "v-3" },
  { idx: [0, 4, 8], cls: "d-1" },
  { idx: [2, 4, 6], cls: "d-2" },
];

function checkTTT(b: number[]) {
  for (const {
    idx: [a, c, d],
    cls,
  } of TTT_LINES)
    if (b[a] !== 0 && b[a] === b[c] && b[c] === b[d])
      return { winner: b[a], cls };
  return null;
}

function checkP4(board: number[]): number {
  const at = (r: number, c: number) => board[r * COLS + c];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++) {
      const p = at(r, c);
      if (p && p === at(r, c + 1) && p === at(r, c + 2) && p === at(r, c + 3))
        return p;
    }
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS; c++) {
      const p = at(r, c);
      if (p && p === at(r + 1, c) && p === at(r + 2, c) && p === at(r + 3, c))
        return p;
    }
  for (let r = 0; r < ROWS - 3; r++)
    for (let c = 0; c < COLS - 3; c++) {
      const p = at(r, c);
      if (
        p &&
        p === at(r + 1, c + 1) &&
        p === at(r + 2, c + 2) &&
        p === at(r + 3, c + 3)
      )
        return p;
    }
  for (let r = 3; r < ROWS; r++)
    for (let c = 0; c < COLS - 3; c++) {
      const p = at(r, c);
      if (
        p &&
        p === at(r - 1, c + 1) &&
        p === at(r - 2, c + 2) &&
        p === at(r - 3, c + 3)
      )
        return p;
    }
  return EMPTY;
}

function dropP4(board: number[], col: number, player: number): number[] | null {
  for (let r = ROWS - 1; r >= 0; r--) {
    const idx = r * COLS + col;
    if (board[idx] === EMPTY) {
      const b = [...board];
      b[idx] = player;
      return b;
    }
  }
  return null;
}

function checkFanorona(board: number[]): number {
  for (const [a, b, c] of [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ])
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c])
      return board[a];
  return 0;
}

// ─── Sub-components ────────────────────────────────────────────────

function ThinkingOverlay({ text }: { text: string }) {
  return (
    <div className="hub-overlay">
      <div className="hub-thinking">
        <span className="hub-spinner" />
        <span>{text}</span>
      </div>
    </div>
  );
}

function GameStatusBar({
  label,
  sub,
  color,
}: {
  label: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="hub-status">
      <span className="hub-status-label" style={color ? { color } : undefined}>
        {label}
      </span>
      {sub && <span className="hub-status-sub">{sub}</span>}
    </div>
  );
}

function ResetBtn({
  onClick,
  label = "Rejouer",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button className="hub-reset-btn" onClick={onClick}>
      {label}
    </button>
  );
}

// ─── TIC TAC TOE ──────────────────────────────────────────────────
function TicTacToeGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(Array(9).fill(0));
  const [turn, setTurn] = useState(X);
  const [thinking, setThinking] = useState(false);

  const winData = checkTTT(board);
  const isDraw = !winData && board.every((c) => c !== 0);

  const handleClick = async (i: number) => {
    if (board[i] !== 0 || winData || isDraw || thinking || turn !== X) return;
    const nb = [...board];
    nb[i] = X;
    setBoard(nb);
    if (checkTTT(nb) || nb.every((c) => c !== 0)) return;
    setTurn(O);
    setThinking(true);
    try {
      const d = await apiPost("/best-move", { board: nb, turn: O });
      setBoard(d.best_board);
      setTurn(d.next_turn);
    } catch {
      setTurn(X);
    } finally {
      setThinking(false);
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(0));
    setTurn(X);
  };

  const statusLabel = winData
    ? `${winData.winner === X ? "❌ X" : "⭕ O"} remporte la partie !`
    : isDraw
      ? "Match nul !"
      : thinking
        ? "L'IA calcule…"
        : turn === X
          ? "Votre tour (X)"
          : "Tour de l'IA (O)";

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
        {thinking && <ThinkingOverlay text="L'IA réfléchit à son coup…" />}
      </div>
    </div>
  );
}

// ─── FANORONA TELO ────────────────────────────────────────────────
const FANORONA_ADJ: number[][] = [
  [1, 3, 4],
  [0, 2, 3, 4, 5],
  [1, 4, 5],
  [0, 1, 4, 6, 7],
  [0, 1, 2, 3, 5, 6, 7, 8],
  [1, 2, 4, 7, 8],
  [3, 4, 7],
  [3, 4, 5, 6, 8],
  [4, 5, 7],
];

function isPlacement(b: number[]): boolean {
  return b.filter((c) => c !== 0).length < 6;
}

function fanoronaSuccessors(board: number[], player: number): number[][] {
  if (isPlacement(board)) {
    return board
      .map((c, i) =>
        c === 0 ? board.map((v, j) => (j === i ? player : v)) : null,
      )
      .filter(Boolean) as number[][];
  }
  const moves: number[][] = [];
  board.forEach((c, i) => {
    if (c !== player) return;
    FANORONA_ADJ[i].forEach((j) => {
      if (board[j] !== 0) return;
      const nb = [...board];
      nb[i] = 0;
      nb[j] = player;
      moves.push(nb);
    });
  });
  return moves;
}

function FanoronaGame({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(Array(9).fill(0));
  const [turn, setTurn] = useState(X);
  const [selected, setSelected] = useState<number | null>(null);
  const [thinking, setThinking] = useState(false);

  const winner = checkFanorona(board);
  const placement = isPlacement(board);
  const validMoves = fanoronaSuccessors(board, turn);

  const playMove = async (nb: number[]) => {
    const next = turn === X ? O : X;
    setBoard(nb);
    setTurn(next);
    if (checkFanorona(nb) !== 0) return;
    setThinking(true);
    try {
      const d = await apiPost("/fanorona-move", { board: nb, turn: next });
      setBoard(d.best_board);
      setTurn(d.next_turn);
    } catch {
    } finally {
      setThinking(false);
    }
  };

  const handleClick = (idx: number) => {
    if (winner !== 0 || turn !== X || thinking) return;
    if (placement) {
      if (board[idx] !== 0) return;
      const move = validMoves.find((m) => m[idx] === X);
      if (move) playMove(move);
    } else {
      if (selected === null) {
        if (board[idx] === X) setSelected(idx);
      } else {
        if (board[idx] === X) {
          setSelected(idx);
          return;
        }
        const move = validMoves.find((m) => m[selected] === 0 && m[idx] === X);
        setSelected(null);
        if (move) playMove(move);
      }
    }
  };

  const reset = () => {
    setBoard(Array(9).fill(0));
    setTurn(X);
    setSelected(null);
  };

  const statusLabel =
    winner !== 0
      ? `${winner === X ? "🔵 X" : "🔴 O"} remporte la partie !`
      : thinking
        ? "L'IA réfléchit…"
        : `Tour de ${turn === X ? "X (vous)" : "O (IA)"} — ${placement ? "Placement" : "Déplacement"}`;

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
        <h2 className="hub-game-title fanorona-accent">Fanorona Telo</h2>
        <ResetBtn onClick={reset} />
      </div>

      <GameStatusBar label={statusLabel} />

      <div className="hub-game-surface" style={{ position: "relative" }}>
        <div className={`fanorona-board${thinking ? " is-thinking" : ""}`}>
          <svg className="fanorona-svg" viewBox="0 0 200 200">
            {/* Grid lines */}
            <line
              x1="100"
              y1="0"
              x2="100"
              y2="200"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="100"
              x2="200"
              y2="100"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="200"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
            <line
              x1="200"
              y1="0"
              x2="0"
              y2="200"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="0"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="200"
              x2="200"
              y2="200"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="200"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
            <line
              x1="200"
              y1="0"
              x2="200"
              y2="200"
              stroke="var(--fan-line)"
              strokeWidth="2"
            />
          </svg>

          <div className="fanorona-points">
            {board.map((cell, idx) => {
              const row = Math.floor(idx / 3),
                col = idx % 3;
              const isSelected = selected === idx;
              const isValidTarget =
                selected !== null &&
                !isPlacement(board) &&
                FANORONA_ADJ[selected].includes(idx) &&
                cell === 0;
              return (
                <button
                  key={idx}
                  className={`fanorona-point${isSelected ? " selected" : ""}${isValidTarget ? " valid-target" : ""}`}
                  style={{ top: `${row * 50}%`, left: `${col * 50}%` }}
                  onClick={() => handleClick(idx)}
                >
                  <div
                    className={`fanorona-piece${cell === X ? " piece-x" : cell === O ? " piece-o" : " piece-empty"}`}
                  >
                    {cell === X && <span>✕</span>}
                    {cell === O && <span>◯</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        {thinking && <ThinkingOverlay text="L'IA cherche son mouvement…" />}
      </div>
    </div>
  );
}

// ─── PUISSANCE 4 ──────────────────────────────────────────────────
function Puissance4Game({ onBack }: { onBack: () => void }) {
  const [board, setBoard] = useState(Array(ROWS * COLS).fill(EMPTY));
  const [turn, setTurn] = useState(X);
  const [winner, setWinner] = useState(EMPTY);
  const [thinking, setThinking] = useState(false);
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  const isFull = board.slice(0, COLS).every((c) => c !== EMPTY);

  const fetchAI = useCallback(async (b: number[]) => {
    setThinking(true);
    try {
      const d = await apiPost("/puissance4-move", { board: b, turn: O });
      setBoard(d.best_board);
      const w = checkP4(d.best_board);
      if (w !== EMPTY) setWinner(w);
      else setTurn(X);
    } catch {
      setTurn(X);
    } finally {
      setThinking(false);
    }
  }, []);

  const handleColClick = (col: number) => {
    if (turn !== X || winner !== EMPTY || thinking || isFull) return;
    const nb = dropP4(board, col, X);
    if (!nb) return;
    setBoard(nb);
    const w = checkP4(nb);
    if (w !== EMPTY) {
      setWinner(w);
      return;
    }
    if (nb.slice(0, COLS).every((c) => c !== EMPTY)) return;
    setTurn(O);
    fetchAI(nb);
  };

  const reset = () => {
    setBoard(Array(ROWS * COLS).fill(EMPTY));
    setTurn(X);
    setWinner(EMPTY);
  };

  const statusLabel =
    winner !== EMPTY
      ? `${winner === X ? "🔴 Rouge" : "🟡 Jaune (IA)"} gagne !`
      : isFull && winner === EMPTY
        ? "Match nul !"
        : thinking
          ? "L'IA cherche la colonne…"
          : turn === X
            ? "Votre tour — Rouge"
            : "Tour de l'IA — Jaune";

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
        {thinking && <ThinkingOverlay text="L'IA évalue les colonnes…" />}
      </div>
    </div>
  );
}

// ─── HUB HOME PAGE ────────────────────────────────────────────────
const GAMES = [
  {
    id: "tictactoe" as GameType,
    title: "Tic-Tac-Toe",
    tagline: "Le grand classique",
    desc: "Alignez 3 symboles avant l'IA sur une grille 3×3. Simple à apprendre, impossible à maîtriser face à Alpha-Beta.",
    badge: "Facile",
    accentClass: "card-ttt",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M8 8l8 8M16 8l-8 8" strokeLinecap="round" />
        <circle cx="36" cy="12" r="6" strokeWidth="2" />
        <path d="M8 28l8 8M16 28l-8 8" strokeLinecap="round" />
        <circle cx="36" cy="36" r="6" strokeWidth="2" />
      </svg>
    ),
    cta: "Jouer →",
  },
  {
    id: "fanorona" as GameType,
    title: "Fanorona Telo",
    tagline: "Jeu traditionnel malgache",
    desc: "Placez vos 3 pions sur la grille, puis déplacez-les le long des lignes pour aligner 3 en ligne.",
    badge: "Stratégie",
    accentClass: "card-fanorona",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="5" />
        <circle cx="36" cy="12" r="5" />
        <circle cx="12" cy="36" r="5" />
        <circle cx="36" cy="36" r="5" />
        <circle cx="24" cy="24" r="5" />
        <line x1="12" y1="12" x2="36" y2="36" />
        <line x1="36" y1="12" x2="12" y2="36" />
        <line x1="12" y1="12" x2="36" y2="12" />
        <line x1="12" y1="36" x2="36" y2="36" />
        <line x1="12" y1="12" x2="12" y2="36" />
        <line x1="36" y1="12" x2="36" y2="36" />
      </svg>
    ),
    cta: "Découvrir →",
  },
  {
    id: "puissance4" as GameType,
    title: "Puissance 4",
    tagline: "La gravité comme alliée",
    desc: "Lâchez vos jetons et anticipez. Alignez 4 en horizontal, vertical ou diagonal avant l'IA.",
    badge: "Classique",
    accentClass: "card-p4",
    icon: (
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="4" y="20" width="40" height="24" rx="4" />
        <circle cx="14" cy="32" r="4" fill="currentColor" opacity=".25" />
        <circle cx="24" cy="32" r="4" fill="currentColor" opacity=".25" />
        <circle cx="34" cy="32" r="4" fill="currentColor" opacity=".25" />
        <circle cx="14" cy="14" r="5" />
        <circle cx="24" cy="8" r="5" />
      </svg>
    ),
    cta: "Lancer →",
  },
];

function HubHome({ onSelect }: { onSelect: (g: GameType) => void }) {
  return (
    <div className="hub-home">
      <section className="hub-hero">
        <h1 className="hub-title">
          Défiez l'Intelligence
          <br />
          <span className="hub-title-accent">Artificielle</span>
        </h1>
      </section>

      <section className="hub-grid">
        {GAMES.map(
          ({ id, title, tagline, desc, badge, accentClass, icon, cta }) => (
            <button
              key={id}
              className={`hub-card ${accentClass}`}
              onClick={() => onSelect(id)}
            >
              <div className="hub-card-badge">{badge}</div>
              <div className="hub-card-icon">{icon}</div>
              <div className="hub-card-body">
                <p className="hub-card-tagline">{tagline}</p>
                <h3 className="hub-card-title">{title}</h3>
                <p className="hub-card-desc">{desc}</p>
              </div>
              <div className="hub-card-cta">{cta}</div>
            </button>
          ),
        )}
      </section>

      <footer className="hub-footer">
        <p>Moteur IA · FastAPI · React · TypeScript</p>
      </footer>
    </div>
  );
}

// ─── ROOT COMPONENT ────────────────────────────────────────────────
export default function GameHub() {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  if (activeGame === "tictactoe")
    return <TicTacToeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "fanorona")
    return <FanoronaGame onBack={() => setActiveGame(null)} />;
  if (activeGame === "puissance4")
    return <Puissance4Game onBack={() => setActiveGame(null)} />;

  return <HubHome onSelect={setActiveGame} />;
}
