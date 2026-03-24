export const ROWS = 6;
export const COLS = 7;
export const BOARD_SIZE = ROWS * COLS;

export const X = 1; // Joueur humain (souvent Rouge ou Jaune)
export const O = -1; // IA
export const EMPTY = 0;

/**
 * Fonction de gravité : Tente de lâcher un pion dans une colonne.
 * Parcourt la colonne de bas en haut pour trouver la première case vide.
 * @returns Le nouveau plateau si le coup est valide, sinon null (colonne pleine).
 */
export const playDrop = (
  board: number[],
  col: number,
  player: number
): number[] | null => {
  for (let r = ROWS - 1; r >= 0; r--) {
    const idx = r * COLS + col;
    if (board[idx] === EMPTY) {
      const newBoard = [...board];
      newBoard[idx] = player;
      return newBoard;
    }
  }
  return null; // La colonne est complètement pleine
};

/**
 * Vérifie toutes les combinaisons possibles pour trouver un gagnant (4 alignés).
 * @returns 1 (X), -1 (O), ou 0 (Aucun gagnant)
 */
export const checkWinner = (board: number[]): number => {
  // 1. Lignes Horizontales (-)
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const idx = r * COLS + c;
      const p = board[idx];
      if (
        p !== EMPTY &&
        p === board[idx + 1] &&
        p === board[idx + 2] &&
        p === board[idx + 3]
      ) {
        return p;
      }
    }
  }

  // 2. Colonnes Verticales (|)
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      const p = board[idx];
      if (
        p !== EMPTY &&
        p === board[(r + 1) * COLS + c] &&
        p === board[(r + 2) * COLS + c] &&
        p === board[(r + 3) * COLS + c]
      ) {
        return p;
      }
    }
  }

  // 3. Diagonales Descendantes (\)
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const idx = r * COLS + c;
      const p = board[idx];
      if (
        p !== EMPTY &&
        p === board[(r + 1) * COLS + c + 1] &&
        p === board[(r + 2) * COLS + c + 2] &&
        p === board[(r + 3) * COLS + c + 3]
      ) {
        return p;
      }
    }
  }

  // 4. Diagonales Montantes (/)
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const idx = r * COLS + c;
      const p = board[idx];
      if (
        p !== EMPTY &&
        p === board[(r - 1) * COLS + c + 1] &&
        p === board[(r - 2) * COLS + c + 2] &&
        p === board[(r - 3) * COLS + c + 3]
      ) {
        return p;
      }
    }
  }

  return EMPTY;
};

/**
 * Vérifie si la grille est totalement remplie (Match nul)
 */
export const isBoardFull = (board: number[]): boolean => {
  // Il suffit de vérifier la ligne du haut (les 7 premières cases)
  for (let c = 0; c < COLS; c++) {
    if (board[c] === EMPTY) return false;
  }
  return true;
};
