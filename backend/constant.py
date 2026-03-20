X_PLAYER = 1
O_PLAYER = -1
PIECES_PER_PLAYER = 3

# Combinaisons gagnantes
LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Horizontales
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Verticales
    [0, 4, 8], [2, 4, 6]              # Diagonales
]

ADJACENCES = [
    [1, 3, 4],
    [0, 2, 4],
    [1, 4, 5],
    [0, 4, 6],
    [0, 1, 2, 3, 5, 6, 7, 8],
    [2, 4, 8],
    [3, 4, 7],
    [6, 4, 8],
    [5, 4, 7]
]