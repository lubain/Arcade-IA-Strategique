from typing import List, Optional
from constant import X_PLAYER, O_PLAYER
from gameNode import GameNode

ROWS = 6
COLS = 7

class Puissance4Node(GameNode['Puissance4Node', int]):
    def __init__(self, board: Optional[List[int]] = None, turn: int = X_PLAYER):
        super().__init__(turn)
        # Un plateau de 42 cases (6 lignes x 7 colonnes)
        self.board = list(board) if board else [0] * (ROWS * COLS)

    def clone(self) -> 'Puissance4Node':
        return Puissance4Node(self.board.copy(), self.turn)

    def play(self, col: int) -> bool:
        # La gravité : on cherche la case vide la plus basse dans la colonne
        # On parcourt de la ligne du bas (5) vers la ligne du haut (0)
        for r in range(ROWS - 1, -1, -1):
            idx = r * COLS + col
            if self.board[idx] == 0:
                self.board[idx] = self.turn
                self.turn = O_PLAYER if self.turn == X_PLAYER else X_PLAYER
                return True
        return False # La colonne est pleine

    def get_successors(self) -> List['Puissance4Node']:
        successors = []
        for c in range(COLS):
            # Si la case tout en haut de la colonne est vide, on peut y jouer
            if self.board[c] == 0:
                child = self.clone()
                child.play(c)
                successors.append(child)
        return successors

    def check_win(self, player: int) -> bool:
        # Vérification Horizontale
        for r in range(ROWS):
            for c in range(COLS - 3):
                if all(self.board[r * COLS + c + i] == player for i in range(4)):
                    return True
        # Vérification Verticale
        for r in range(ROWS - 3):
            for c in range(COLS):
                if all(self.board[(r + i) * COLS + c] == player for i in range(4)):
                    return True
        # Vérification Diagonale (Montante /)
        for r in range(3, ROWS):
            for c in range(COLS - 3):
                if all(self.board[(r - i) * COLS + c + i] == player for i in range(4)):
                    return True
        # Vérification Diagonale (Descendante \)
        for r in range(ROWS - 3):
            for c in range(COLS - 3):
                if all(self.board[(r + i) * COLS + c + i] == player for i in range(4)):
                    return True
        return False

    def evaluate(self, player: int) -> float:
        # 1. Condition de Victoire / Défaite absolue
        if self.check_win(player):
            return 10000.0
        if self.check_win(-player):
            return -10000.0

        score = 0.0

        # 2. Heuristique : Contrôle du centre (Crucial au Puissance 4)
        # Plus on a de pions dans la colonne centrale (colonne 3), plus on a de chances de faire des lignes.
        center_col = COLS // 2
        my_center_pieces = sum(1 for r in range(ROWS) if self.board[r * COLS + center_col] == player)
        opp_center_pieces = sum(1 for r in range(ROWS) if self.board[r * COLS + center_col] == -player)
        
        score += my_center_pieces * 5
        score -= opp_center_pieces * 5

        # (Optionnel : On pourrait ajouter des points pour les "3 alignés", mais cela suffit pour une IA basique forte)
        return score

    def is_terminal(self) -> bool:
        # La partie s'arrête si quelqu'un a gagné, ou s'il n'y a plus de cases vides (match nul)
        return self.check_win(X_PLAYER) or self.check_win(O_PLAYER) or (0 not in self.board)