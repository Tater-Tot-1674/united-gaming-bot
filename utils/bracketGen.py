import random
from datetime import datetime


def shuffle_players(players):
    shuffled = players[:]
    random.shuffle(shuffled)
    return shuffled


def generate_bracket(players):
    if not isinstance(players, list):
        print("❌ generate_bracket received non-list players")
        return {"created": datetime.utcnow().isoformat(), "rounds": []}

    shuffled = shuffle_players(players)
    bracket = []

    for i in range(0, len(shuffled), 2):
        bracket.append({
            "matchId": f"match_{i // 2 + 1}",
            "player1": shuffled[i],
            "player2": shuffled[i + 1] if i + 1 < len(shuffled) else None,
            "winner": None
        })

    print(f"🧩 Bracket generated with {len(bracket)} matches")

    return {
        "created": datetime.utcnow().isoformat(),
        "rounds": [bracket]
    }

