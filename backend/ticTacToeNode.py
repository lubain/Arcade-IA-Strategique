from typing import Optional, List
from gameNode import GameNode
from constant import O_PLAYER, X_PLAYER

class TicTacToeNode(GameNode['TicTacToeNode', int]):
    def __init__(self, board: Optional[List[int]] = None, turn: int = X_PLAYER):
        super().__init__(turn)
        # Copie le tableau s'il existe, sinon crée un tableau vide (9 zéros)
        self.board = list(board) if board else [0] * 9

    def play(self, position: int) -> None:
        self.board[position] = self.turn
        self.turn = O_PLAYER if self.turn == X_PLAYER else X_PLAYER

    def clone(self) -> 'TicTacToeNode':
        return TicTacToeNode(board=self.board.copy(), turn=self.turn)

    def get_successors(self) -> List['TicTacToeNode']:
        successors = []
        for i in range(len(self.board)):
            if self.board[i] == 0:
                child = self.clone()
                child.play(i)
                successors.append(child)
        return successors

    def evaluate(self, player: int) -> float:
        b = self.board
        lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Lignes
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Colonnes
            [0, 4, 8], [2, 4, 6]              # Diagonales
        ]

        for a, b1, c in lines:
            if b[a] != 0 and b[a] == b[b1] and b[b1] == b[c]:
                return float(b[a] * player * 100)
        return 0.0

    def is_full(self) -> bool:
        return all(cell != 0 for cell in self.board)

    def is_terminal(self) -> bool:
        return self.evaluate(X_PLAYER) != 0.0 or self.is_full()
