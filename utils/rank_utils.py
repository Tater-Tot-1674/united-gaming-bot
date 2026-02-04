def get_rank_from_xp(xp):
    if xp >= 1000:
        return "Diamond"
    if xp >= 700:
        return "Platinum"
    if xp >= 500:
        return "Gold"
    if xp >= 300:
        return "Silver"
    if xp >= 100:
        return "Bronze"
    return "Rookie"


def update_rank(player):
    old_rank = player.get("rank")
    new_rank = get_rank_from_xp(player.get("xp", 0))

    if old_rank != new_rank:
        print(f"🏅 Rank updated: {player.get('name')} {old_rank} → {new_rank}")

    player["rank"] = new_rank

