from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from ticTacToeNode import TicTacToeNode
from fanoronaTelo import FanoronaTeloNode
from alpha_beta import alpha_beta
from typing import List
from pydantic import BaseModel, Field
import math
from constant import O_PLAYER, X_PLAYER

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Autorise plusieurs origines locales pour éviter les erreurs CORS en dev
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Schéma de requête attendu
class GameRequest(BaseModel):
    # Validation stricte : exactement 9 éléments
    board: List[int] = Field(..., min_length=9, max_length=9, description="Plateau de 9 cases contenant 0, 1 ou -1")
    turn: int = Field(..., description="Joueur dont c'est le tour: 1 (X) ou -1 (O)")

# Schéma de réponse
class GameResponse(BaseModel):
    best_board: List[int]
    next_turn: int
    message: str

@app.post("/best-move", response_model=GameResponse)
def get_best_move(request: GameRequest):
    # Validation personnalisée pour le contenu du tableau et le joueur
    if request.turn not in [X_PLAYER, O_PLAYER]:
        raise HTTPException(status_code=400, detail="Le tour doit être 1 ou -1.")
    if any(cell not in [0, 1, -1] for cell in request.board):
        raise HTTPException(status_code=400, detail="Le plateau ne peut contenir que 0, 1, ou -1.")

    # Création du nœud racine
    node = TicTacToeNode(board=request.board, turn=request.turn)

    # Vérifier si la partie est déjà terminée
    if node.is_terminal():
        raise HTTPException(status_code=400, detail="La partie est déjà terminée sur ce plateau.")

    # Exécution de l'algorithme (profondeur de 9 pour Tic-Tac-Toe)
    alpha_beta(node, depth=9, alpha=-math.inf, beta=math.inf, maximizing_player=node.turn)

    if node.best is None:
        raise HTTPException(status_code=500, detail="Impossible de trouver un mouvement valide.")

    return GameResponse(
        best_board=node.best.board,
        next_turn=node.best.turn,
        message="Meilleur coup calculé avec succès."
    )

@app.post("/fanorona-move")
def get_fanorona_move(request: GameRequest):
    node = FanoronaTeloNode(board=request.board, turn=request.turn)
    
    if node.is_terminal():
        raise HTTPException(status_code=400, detail="Partie finie")

    alpha_beta(node, depth=9, alpha=-math.inf, beta=math.inf, maximizing_player=node.turn)

    print(node.best.turn)

    return GameResponse(
        best_board=node.best.board,
        next_turn=node.best.turn,
        message="Meilleur coup calculé avec succès."
    )