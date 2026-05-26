# Strategy AI Games

> Trois jeux de stratégie classiques contre une intelligence artificielle propulsée par l'algorithme **Alpha-Beta** — Tic-Tac-Toe, Fanorona Telo et Puissance 4.

```
 ┌─────────────────────────────────────────────────┐
 │   ❌⭕  Tic-Tac-Toe  ·  ⬡ Fanorona  ·  🔴 P4  │
 │              Moteur IA : Alpha-Beta             │
 └─────────────────────────────────────────────────┘
```

---

## Sommaire

- [Aperçu](#aperçu)
- [Architecture](#architecture)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Moteur IA : Alpha-Beta](#moteur-ia--alpha-beta)
- [Les jeux](#les-jeux)
  - [Tic-Tac-Toe](#tic-tac-toe)
  - [Fanorona Telo](#fanorona-telo)
  - [Puissance 4](#puissance-4)
- [Installation et lancement](#installation-et-lancement)
  - [Prérequis](#prérequis)
  - [Développement local](#développement-local)
  - [Docker (recommandé)](#docker-recommandé)
- [Variables d'environnement](#variables-denvironnement)
- [API Reference](#api-reference)
- [Frontend : GameHub](#frontend--gamehub)
- [Tests et qualité](#tests-et-qualité)
- [Déploiement en production](#déploiement-en-production)
- [Contribuer](#contribuer)

---

## Aperçu

**Strategy AI Games** est une application web full-stack permettant d'affronter une IA sur trois jeux de réflexion. L'IA ne triche pas — elle calcule le meilleur coup possible à partir de la position actuelle grâce à l'algorithme minimax avec élagage Alpha-Beta, implémenté côté serveur en Python.

**Côté joueur :**
- Vous jouez toujours en premier (pièces `X` / Rouge selon le jeu)
- L'IA répond automatiquement après chaque coup
- Un indicateur visuel s'affiche pendant le calcul de l'IA

---

## Architecture

```
┌────────────────────────────────────────────────────┐
│                     Navigateur                     │
│   React + TypeScript + Tailwind CSS (Vite)         │
│                                                    │
│   GameHub ──► TicTacToe / FanoronaTelo / Puissance4│
│       │                    │                       │
│       └────── Hooks ───────┘                       │
│                   │                                │
│               api.ts (fetch)                       │
└───────────────────┬────────────────────────────────┘
                    │ HTTP POST JSON
                    ▼
┌────────────────────────────────────────────────────┐
│               FastAPI (Python)                     │
│                                                    │
│   /best-move         → TicTacToeNode               │
│   /fanorona-move     → FanoronaTeloNode            │
│   /puissance4-move   → Puissance4Node              │
│                    │                               │
│           alpha_beta(node, depth, α, β)            │
└────────────────────────────────────────────────────┘
```

Le frontend envoie l'état du plateau (tableau d'entiers) et le joueur courant. Le backend calcule le meilleur coup via Alpha-Beta et retourne le nouveau plateau.

---

## Stack technique

| Couche | Technologie | Version |
|--------|-------------|---------|
| Frontend | React | 19 |
| Langage frontend | TypeScript | ~5.8 |
| Build tool | Vite (rolldown-vite) | 7.x |
| Style | Tailwind CSS | 4.x |
| Animations | Framer Motion | 12.x |
| Backend | FastAPI | latest |
| Serveur ASGI | Uvicorn | 0.30.6 |
| Validation | Pydantic | 2.8.2 |
| Conteneurisation | Docker + Docker Compose | — |

### Représentation du plateau

Tous les plateaux utilisent une **convention unifiée** : un tableau d'entiers plat.

| Valeur | Signification |
|--------|---------------|
| `1` (`X_PLAYER`) | Joueur humain |
| `-1` (`O_PLAYER`) | IA |
| `0` | Case vide |

---

## Structure du projet

```
strategy-ai-games/
├── backend/
│   ├── alpha_beta.py          # Algorithme Alpha-Beta générique
│   ├── gameNode.py            # Classe abstraite GameNode (ABC)
│   ├── ticTacToeNode.py       # Logique Tic-Tac-Toe
│   ├── fanoronaTelo.py        # Logique Fanorona Telo
│   ├── puissance4.py          # Logique Puissance 4
│   ├── constant.py            # Constantes partagées (joueurs, lignes, adjacences)
│   ├── config.py              # Config via pydantic-settings (.env)
│   ├── main.py                # Routes FastAPI
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── applications/
│   │   │   ├── hooks/
│   │   │   │   ├── useTicTacToeGame.ts
│   │   │   │   ├── useFanoronaGame.ts
│   │   │   │   └── usePuissance4Game.ts
│   │   │   └── utils/
│   │   │       ├── checkTTT.ts
│   │   │       ├── checkFanorona.ts
│   │   │       ├── checkP4.ts
│   │   │       ├── dropP4.ts
│   │   │       ├── fanoronaSuccessors.ts
│   │   │       ├── isPlacement.ts
│   │   │       └── index.ts
│   │   ├── domain/
│   │   │   ├── constants/
│   │   │   │   ├── API.ts
│   │   │   │   ├── COLS.ts
│   │   │   │   ├── EMPTY.ts
│   │   │   │   ├── FANORONA_ADJ.ts
│   │   │   │   ├── GAMES.tsx
│   │   │   │   ├── O.ts
│   │   │   │   ├── ROWS.ts
│   │   │   │   ├── TTT_LINES.ts
│   │   │   │   ├── X.ts
│   │   │   │   └── index.ts
│   │   │   └── types/
│   │   │       ├── GameType.ts
│   │   │       └── index.ts
│   │   ├── infrastructure/
│   │   │   └── ApiPost.ts              # Appels HTTP vers le backend
│   │   ├── presentation/
│   │   │   ├── page/
│   │   │   │   ├── GameHub.tsx         # Page d'accueil + routing des jeux
│   │   │   │   ├── TicTacToeGame.tsx
│   │   │   │   ├── FanoronaGame.tsx
│   │   │   │   └── Puissance4Game.tsx
│   │   │   ├── components/
│   │   │   │   ├── GameStatusBar.tsx
│   │   │   │   ├── ThinkingOverlay.tsx
│   │   │   │   └── ui/
│   │   │   │       └── ResetBtn.tsx
│   │   │   └── styles/
│   │   │       ├── App.css
│   │   │       └── index.css
│   │   ├── assets/
│   │   └── main.tsx
│   ├── public/
│   ├── nginx/
│   │   └── default.conf
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── eslint.config.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## Moteur IA : Alpha-Beta

### Principe

L'algorithme **minimax avec élagage Alpha-Beta** explore l'arbre des coups possibles en profondeur. Il cherche le coup qui maximise le score pour l'IA, en supposant que le joueur humain joue aussi de manière optimale.

L'élagage `α-β` permet d'**éliminer les branches inutiles** sans changer le résultat — ce qui réduit drastiquement le nombre de nœuds explorés.

```
         Racine (IA maximise)
        /         |         \
      n1          n2         n3
    /    \       /  \       /  \
  n11   n12   n21  n22   n31  n32
   ✓     ✓     ✓    ✗     ✓    ✗
                    ↑          ↑
               (élagué)   (élagué)
```

### Implémentation Python (`alpha_beta.py`)

```python
def alpha_beta(node, depth, alpha, beta, maximizing_player):
    if depth == 0 or node.is_terminal():
        return node.evaluate(maximizing_player)

    children = node.get_successors()
    node.best = None

    if node.turn == maximizing_player:         # Tour de l'IA → maximise
        value = -math.inf
        for child in children:
            eval_value = alpha_beta(child, depth-1, alpha, beta, maximizing_player)
            if eval_value > value:
                value = eval_value
                node.best = child             # Mémorise le meilleur coup
            alpha = max(alpha, value)
            if beta <= alpha:                 # Élagage β
                break
        return value
    else:                                      # Tour du joueur → minimise
        value = math.inf
        for child in children:
            eval_value = alpha_beta(child, depth-1, alpha, beta, maximizing_player)
            if eval_value < value:
                value = eval_value
                node.best = child
            beta = min(beta, value)
            if beta <= alpha:                 # Élagage α
                break
        return value
```

### Classe abstraite `GameNode`

Chaque jeu hérite de `GameNode` et implémente trois méthodes :

```python
class GameNode(ABC):
    def get_successors(self) -> List[GameNode]: ...  # États fils possibles
    def is_terminal(self) -> bool: ...               # Fin de partie ?
    def evaluate(self, player: int) -> float: ...    # Score heuristique
```

### Profondeurs de recherche

| Jeu | Profondeur | Raison |
|-----|-----------|--------|
| Tic-Tac-Toe | 9 | Arbre complet (9 cases max) — solution exacte |
| Fanorona Telo | 9 | Espace d'états limité — quasi-optimal |
| Puissance 4 | 5 | Grille 6×7 trop large pour exploration complète |

---

## Les jeux

### Tic-Tac-Toe

**Règles :** Grille 3×3. Le joueur X place un symbole par tour. Le premier à aligner 3 symboles (horizontal, vertical, ou diagonal) gagne.

**Représentation :** Tableau de 9 entiers (`index 0` = case haut-gauche, `index 8` = case bas-droite).

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

**Heuristique :** Victoire = `+∞`, Défaite = `-∞`, Nul = `0`. L'IA joue parfaitement (jeu résolu).

**Endpoint :** `POST /best-move`

---

### Fanorona Telo

Le **Fanorona** est un jeu de stratégie traditionnel **malgache**. Fanorona Telo en est la version simplifiée (3 pièces par joueur).

**Phase 1 — Placement :** Les deux joueurs placent alternativement leurs 3 pièces sur les 9 intersections de la grille, jusqu'à ce que toutes les pièces soient posées.

**Phase 2 — Déplacement :** Les joueurs déplacent leurs pièces vers une intersection adjacente libre. Les cases du coin et du bord n'ont que 4 voisins (4 directions), mais le centre et les cases de parité paire permettent des déplacements diagonaux (8 directions).

```
  0 — 1 — 2
  |×  |  ×|
  3 — 4 — 5
  |×  |  ×|
  6 — 7 — 8
  (× = diagonales disponibles aux nœuds de parité paire)
```

**Victoire :** Aligner 3 pièces sur une ligne gagnante.

**Heuristique du backend :**
- Victoire/Défaite : ±100
- Case centrale (4) : ±10
- Menace (2 pièces alignées + 1 case vide) : +20 attaque / -50 défense

**Endpoint :** `POST /fanorona-move`

---

### Puissance 4

**Règles :** Grille 6 lignes × 7 colonnes. Les jetons tombent par gravité (la case vide la plus basse de la colonne choisie). Le premier à aligner 4 jetons (horizontal, vertical, ou diagonal) gagne.

**Représentation :** Tableau de 42 entiers. `index = ligne × 7 + colonne`, avec la ligne 0 en haut.

```
Col : 0  1  2  3  4  5  6
      .  .  .  .  .  .  .   ← ligne 0 (haut)
      .  .  .  .  .  .  .
      .  .  .  .  .  .  .
      .  .  .  .  .  .  .
      .  .  .  .  .  .  .
      .  .  .  .  .  .  .   ← ligne 5 (bas, cases remplies en premier)
```

**Heuristique du backend :** Évalue les fenêtres de 4 cases dans toutes les directions, avec un bonus pour les pièces centrales.

**Endpoint :** `POST /puissance4-move`

---

## Installation et lancement

### Prérequis

- **Node.js** ≥ 18
- **Python** ≥ 3.11
- **Docker & Docker Compose** (optionnel mais recommandé)

---

### Développement local

#### 1. Backend

```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv .venv
source .venv/bin/activate   # Windows : .venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer l'environnement
cp .env.example .env
# Modifier .env si nécessaire

# Lancer le serveur (rechargement automatique)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Le backend est accessible sur `http://localhost:8000`.  
Documentation interactive Swagger : `http://localhost:8000/docs`

#### 2. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# VITE_API_URL=http://localhost:8000

# Lancer le serveur de développement
npm run dev
```

Le frontend est accessible sur `http://localhost:5173`.

---

### Docker (recommandé)

#### Développement

```bash
# Depuis la racine du projet
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

#### Production

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

---

## Variables d'environnement

### Backend (`backend/.env`)

| Variable | Défaut | Description |
|----------|--------|-------------|
| `FRONTEND_URLS` | `http://localhost:5173,http://localhost:3000` | Origines autorisées (CORS), séparées par des virgules |

```env
# backend/.env
FRONTEND_URLS=http://localhost:5173,https://votre-domaine.com
```

### Frontend (`frontend/.env`)

| Variable | Défaut | Description |
|----------|--------|-------------|
| `VITE_API_URL` | `/api` | URL de base du backend FastAPI |

```env
# frontend/.env
VITE_API_URL=http://localhost:8000
```

> En production avec Nginx comme proxy, `VITE_API_URL` peut rester à `/api`.

---

## API Reference

Tous les endpoints acceptent et retournent du JSON.

### `POST /best-move` — Tic-Tac-Toe

**Corps de la requête :**

```json
{
  "board": [1, 0, -1, 0, 1, 0, 0, 0, -1],
  "turn": -1
}
```

**Réponse :**

```json
{
  "best_board": [1, 0, -1, 0, 1, 0, 0, -1, -1],
  "next_turn": 1,
  "message": "Meilleur coup calculé avec succès."
}
```

**Validations :**
- `turn` doit être `1` ou `-1`
- `board` ne peut contenir que `0`, `1`, ou `-1`
- La partie ne doit pas être déjà terminée

---

### `POST /fanorona-move` — Fanorona Telo

**Corps de la requête :**

```json
{
  "board": [1, 0, -1, 0, 1, 0, -1, 0, 0],
  "turn": -1
}
```

**Réponse :**

```json
{
  "best_board": [1, 0, -1, 0, 1, -1, 0, 0, 0],
  "next_turn": 1,
  "message": "Meilleur coup calculé avec succès."
}
```

---

### `POST /puissance4-move` — Puissance 4

**Corps de la requête :**

```json
{
  "board": [0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0],
  "turn": -1
}
```

**Réponse :**

```json
{
  "best_board": [...],
  "next_turn": 1
}
```

---

### Codes d'erreur

| Code | Description |
|------|-------------|
| `400` | Plateau invalide, partie déjà terminée, ou tour incorrect |
| `500` | Aucun coup valide trouvé (cas anormal) |

---

## Frontend : GameHub

### Routing des jeux

`GameHub.tsx` est le composant racine. Il gère un état `activeGame` (null | "tictactoe" | "fanorona" | "puissance4") et affiche soit la page d'accueil, soit le composant du jeu sélectionné.

```tsx
type GameType = "tictactoe" | "fanorona" | "puissance4" | null;
const [activeGame, setActiveGame] = useState<GameType>(null);
```

### Hook `useDelayedThinking`

Évite un clignotement d'interface si l'IA répond très rapidement. L'indicateur de chargement n'apparaît qu'après un délai de 1 seconde.

```ts
const { isThinking, beginThinking, stopThinking } = useDelayedThinking(1000);
```

### Classe `GetBestMoveIa` (`api.ts`)

Point d'entrée unique pour tous les appels HTTP vers le backend.

```ts
const ia = new GetBestMoveIa();

// Tic-Tac-Toe
const data = await ia.bestMoveTicTacToe(board, nextTurn);

// Fanorona
const data = await ia.bestMoveFanorona(board, nextTurn);

// Puissance 4
const data = await ia.bestMovePuissance4(board);
```

### `FanoronaTeloNode` côté client (`FanoronaTelo.ts`)

Une implémentation TypeScript miroir du backend est disponible côté client. Elle permet de valider les coups du joueur localement (génération des successeurs, vérification de victoire) sans aller-retour réseau.

---

## Tests et qualité

### Linting

```bash
cd frontend
npm run lint
```

### Vérification TypeScript

```bash
cd frontend
npx tsc --noEmit
```

### Tester l'API manuellement

```bash
# Tic-Tac-Toe : plateau vide, tour de l'IA
curl -X POST http://localhost:8000/best-move \
  -H "Content-Type: application/json" \
  -d '{"board": [1,0,0,0,0,0,0,0,0], "turn": -1}'

# Fanorona : vérifier la doc Swagger
open http://localhost:8000/docs
```

---

## Déploiement en production

### Avec Docker

```bash
# Construire et lancer en arrière-plan
docker compose -f docker-compose.prod.yml up --build -d

# Voir les logs
docker compose -f docker-compose.prod.yml logs -f

# Arrêter
docker compose -f docker-compose.prod.yml down
```

### Avec Nginx (reverse proxy)

Si vous déployez derrière Nginx, configurez le proxy pour router `/api/` vers le backend :

```nginx
location /api/ {
    proxy_pass http://backend:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
}
```

La configuration Nginx du projet se trouve dans `frontend/nginx/default.conf`.

### Build frontend seul

```bash
cd frontend
npm run build
# Les fichiers statiques sont générés dans dist/
```

---

## Contribuer

### Ajouter un nouveau jeu

Pour intégrer un nouveau jeu dans l'architecture, il suffit de :

**1. Backend — Créer un `GameNode` :**

```python
# backend/monJeu.py
from gameNode import GameNode

class MonJeuNode(GameNode['MonJeuNode', int]):
    def __init__(self, board=None, turn=X_PLAYER):
        super().__init__(turn)
        self.board = board or [0] * TAILLE

    def get_successors(self): ...   # Retourne les états fils possibles
    def is_terminal(self): ...      # True si la partie est finie
    def evaluate(self, player): ... # Score heuristique
```

**2. Backend — Ajouter un endpoint dans `main.py` :**

```python
@app.post("/mon-jeu-move")
def get_mon_jeu_move(request: GameRequest):
    node = MonJeuNode(board=request.board, turn=request.turn)
    alpha_beta(node, depth=6, alpha=-math.inf, beta=math.inf,
               maximizing_player=node.turn)
    return {"best_board": node.best.board, "next_turn": node.best.turn}
```

**3. Frontend — Ajouter l'appel API dans `api.ts` :**

```ts
async bestMoveMonJeu(board: number[], turn: number) {
  const response = await fetch(`${apiBaseUrl}/mon-jeu-move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ board, turn }),
  });
  return response.json();
}
```

**4. Frontend — Créer le composant et l'enregistrer dans `GameHub.tsx`.**

---

## Licence

Ce projet est distribué sous licence **MIT**.  
Voir le fichier `frontend/LICENSE` pour les détails.

---

## Auteur

Projet développé avec passion pour explorer l'IA dans les jeux de stratégie.  
Moteur Alpha-Beta · FastAPI · React · TypeScript · Docker
