import { GameNode, alphaBeta } from "@/game/GameNode";

export type Player = 1 | -1;
export type Cell = Player | 0;

export const X: Player = 1;
export const O: Player = -1;

export class TicTacToeNode extends GameNode<TicTacToeNode, Player> {
  board: Cell[];

  constructor(board?: Cell[], turn: Player = X) {
    super(turn);
    this.board = board ? [...board] : new Array(9).fill(0);
  }

  play(position: number): void {
    this.board[position] = this.turn;
    this.turn = this.turn === X ? O : X;
  }

  clone(): TicTacToeNode {
    return new TicTacToeNode([...this.board], this.turn);
  }

  getSuccessors(): TicTacToeNode[] {
    const successors: TicTacToeNode[] = [];

    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i] === 0) {
        const child = this.clone();
        child.play(i);
        successors.push(child);
      }
    }

    return successors;
  }

  evaluate(player: Player): number {
    const b = this.board;

    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b1, c] of lines) {
      if (b[a] !== 0 && b[a] === b[b1] && b[b1] === b[c]) {
        return b[a] * player * 100;
      }
    }

    return 0;
  }

  isFull(): boolean {
    return this.board.every((cell) => cell !== 0);
  }

  isTerminal(): boolean {
    return this.evaluate(X) !== 0 || this.isFull();
  }
}

export function getBestMove(
  node: TicTacToeNode,
  depth: number = 9
): TicTacToeNode {
  alphaBeta(node, depth, -Infinity, Infinity, node.turn);
  return node.best!;
}
