import { GameNode, alphaBeta } from "@/game/GameNode";

export type Player = 1 | -1;
export type Cell = Player | 0;

export const X: Player = 1;
export const O: Player = -1;

const WIDTH = 3;
const HEIGHT = 3;
const BOARD_SIZE = WIDTH * HEIGHT;
const PIECES_PER_PLAYER = 3;

type Dir = { dx: number; dy: number };

const DIRS_4: Dir[] = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },
];

const DIRS_8: Dir[] = [
  ...DIRS_4,
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: -1 },
];

const inBounds = (x: number, y: number): boolean =>
  x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT;

const toIndex = (x: number, y: number): number => y * WIDTH + x;

const fromIndex = (index: number): { x: number; y: number } => ({
  x: index % WIDTH,
  y: Math.floor(index / WIDTH),
});

const getDirsFor = (x: number, y: number): Dir[] => {
  // Diagonales uniquement aux intersections de parité paire.
  return (x + y) % 2 === 0 ? DIRS_8 : DIRS_4;
};

const getAdjacent = (index: number): number[] => {
  const { x, y } = fromIndex(index);
  const dirs = getDirsFor(x, y);
  const result: number[] = [];

  for (const dir of dirs) {
    const nx = x + dir.dx;
    const ny = y + dir.dy;
    if (!inBounds(nx, ny)) continue;
    result.push(toIndex(nx, ny));
  }

  return result;
};

const countPieces = (board: Cell[], player: Player): number =>
  board.reduce((acc, cell) => (cell === player ? ((acc + 1) as Cell) : acc), 0);

const opponentOf = (player: Player): Player => (player === X ? O : X);

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

const getWinner = (board: Cell[]): Player | 0 => {
  for (const [a, b, c] of LINES) {
    if (board[a] !== 0 && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }
  return 0;
};

export class FanoronaTeloNode extends GameNode<FanoronaTeloNode, Player> {
  board: Cell[];

  constructor(board?: Cell[], turn: Player = X) {
    super(turn);
    this.board = board ? [...board] : new Array(BOARD_SIZE).fill(0);
  }

  clone(): FanoronaTeloNode {
    return new FanoronaTeloNode([...this.board], this.turn);
  }

  isPlacementPhase(): boolean {
    const total = countPieces(this.board, X) + countPieces(this.board, O);
    return total < PIECES_PER_PLAYER * 2;
  }

  evaluate(player: Player): number {
    if (this.isPlacementPhase()) {
      const winner = getWinner(this.board);
      if (winner !== 0) {
        return winner === player ? 100 : -100;
      }
    }

    const myMoves = this.getMoveCount(player);
    const oppMoves = this.getMoveCount(opponentOf(player));
    return myMoves - oppMoves;
  }

  isTerminal(): boolean {
    if (getWinner(this.board) !== 0) return true;
    return this.getSuccessors().length === 0;
  }

  getSuccessors(): FanoronaTeloNode[] {
    const player = this.turn;
    const successors: FanoronaTeloNode[] = [];

    if (this.isPlacementPhase()) {
      for (let i = 0; i < BOARD_SIZE; i++) {
        if (this.board[i] !== 0) continue;
        const nextBoard = [...this.board];
        nextBoard[i] = player;
        successors.push(new FanoronaTeloNode(nextBoard, opponentOf(player)));
      }
      return successors;
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.board[i] !== player) continue;
      for (const next of getAdjacent(i)) {
        if (this.board[next] !== 0) continue;
        const nextBoard = [...this.board];
        nextBoard[i] = 0;
        nextBoard[next] = player;
        successors.push(new FanoronaTeloNode(nextBoard, opponentOf(player)));
      }
    }

    return successors;
  }

  getWinner(): Player | 0 {
    return getWinner(this.board);
  }

  private getMoveCount(player: Player): number {
    if (this.isPlacementPhase()) {
      return this.board.filter((cell) => cell === 0).length;
    }

    let moves = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (this.board[i] !== player) continue;
      for (const next of getAdjacent(i)) {
        if (this.board[next] === 0) moves += 1;
      }
    }
    return moves;
  }
}

export function getBestMove(
  node: FanoronaTeloNode,
  depth: number = 9
): FanoronaTeloNode {
  alphaBeta(node, depth, -Infinity, Infinity, node.turn);
  return node.best ?? node;
}
