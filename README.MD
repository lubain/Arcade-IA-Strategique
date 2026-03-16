# Jeux IA (Alpha-Beta)

Petit projet React/TypeScript qui regroupe des jeux de plateau jouables contre une IA basée sur l'algorithme **alpha-bêta**.

**Jeux inclus**

1. **Tic Tac Toe** (3×3)  
   Aligner trois symboles. Placement alterné.
1. **Fanorona Telo** (3×3)  
   Trois pions par joueur, phase de placement puis phase de déplacement. Aucune capture, victoire par alignement de trois.

**IA (Alpha-Beta)**

1. L'IA explore l'arbre des coups avec **alpha-bêta** pour réduire le nombre d'états évalués.
1. Les nœuds de jeu héritent de `GameNode` et implémentent `getSuccessors`, `evaluate` et `isTerminal`.

**Démarrage**

```bash
npm install
npm run dev
```

**Structure**

1. `src/game/GameNode.ts` : base des jeux + alpha-bêta
1. `src/game/TicTacToe.ts` : logique Tic Tac Toe
1. `src/game/FanoronaTelo.ts` : logique Fanorona Telo
1. `src/presentation/components` : interfaces React

Si tu veux ajouter un nouveau jeu ou ajuster la difficulté de l'IA, je peux t'aider à le faire.
