import json
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

def calculate_leaderboard():
    players_path = DATA_PATHS["PLAYERS"]
    leaderboard_path = DATA_PATHS["LEADERBOARD_WEEKLY"]

    try:
        with open(players_path, "r", encoding="utf8") as f:
            players = json.load(f)
    except:
        players = []

    sorted_players = sorted(players, key=lambda p: p.get("xp", 0), reverse=True)

    leaderboard = [
        {
            "rank": index + 1,
            "name": player.get("name"),
            "points": player.get("xp"),
            "discordId": player.get("discordId")
        }
        for index, player in enumerate(sorted_players)
    ]

    with open(leaderboard_path, "w", encoding="utf8") as f:
        json.dump(leaderboard, f, indent=2)

    try:
        sync_to_site("leaderboard_weekly.json", WEBSITE_REPO, GITHUB_TOKEN)
    except Exception as e:
        print(f"❌ Failed to sync leaderboard: {e}")
