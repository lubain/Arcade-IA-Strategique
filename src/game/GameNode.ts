export abstract class GameNode<TNode, TPlayer> {
  turn: TPlayer;
  best: TNode | null;

  constructor(turn: TPlayer) {
    this.turn = turn;
    this.best = null;
  }

  abstract getSuccessors(): TNode[];
  abstract isTerminal(): boolean;
  abstract evaluate(player: TPlayer): number;
}

export function alphaBeta<TNode extends GameNode<TNode, TPlayer>, TPlayer>(
  node: TNode,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: TPlayer
): number {
  if (depth === 0 || node.isTerminal()) {
    return node.evaluate(maximizingPlayer);
  }

  const children = node.getSuccessors();
  node.best = null;

  if (node.turn === maximizingPlayer) {
    let value = -Infinity;

    for (const child of children) {
      const evalValue = alphaBeta(
        child,
        depth - 1,
        alpha,
        beta,
        maximizingPlayer
      );

      if (evalValue > value) {
        value = evalValue;
        node.best = child;
      }

      alpha = Math.max(alpha, value);
      if (beta <= alpha) {
        break;
      }
    }

    return value;
  }

  let value = Infinity;

  for (const child of children) {
    const evalValue = alphaBeta(
      child,
      depth - 1,
      alpha,
      beta,
      maximizingPlayer
    );

    if (evalValue < value) {
      value = evalValue;
      node.best = child;
    }

    beta = Math.min(beta, value);
    if (beta <= alpha) {
      break;
    }
  }

  return value;
}
