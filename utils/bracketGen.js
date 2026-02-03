import random
from datetime import datetime

def shuffle(array):
    arr = array[:]  # copy
    random.shuffle(arr)
    return arr

def generate_bracket(players):
    shuffled = shuffle(players)
    bracket = []

    for i in range(0, len(shuffled), 2):
        bracket.append({
            "matchId": f"match_{i // 2 + 1}",
            "player1": shuffled[i],
            "player2": shuffled[i + 1] if i + 1 < len(shuffled) else None,
            "winner": None
        })

    return {
        "created": datetime.utcnow().isoformat(),
        "rounds": [bracket]
    }

