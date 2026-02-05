import json
from datetime import datetime
from utils.syncToSite import sync_to_site
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN

PLAYERS_PATH = DATA_PATHS["PLAYERS"]


def load_players():
    try:
        with open(PLAYERS_PATH, "r", encoding="utf8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        print(f"❌ JSON error in players file: {e}")
        return []


def save_players(players):
    with open(PLAYERS_PATH, "w", encoding="utf8") as f:
        json.dump(players, f, indent=2)

    try:
        sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
        print("✅ players.json synced successfully")
    except Exception as e:
        print(f"❌ Failed to sync players.json: {e}")


class PlayerService:
    def register_player(self, discord_id: int, username: str, team: str):
        players = load_players()
        existing = next((p for p in players if p["discord_id"] == discord_id), None)

        if existing:
            return {"success": False, "message": "You are already registered."}

        player = {
            "discord_id": discord_id,
            "username": username,
            "team": team,
            "xp": 0,
            "rank": "Unranked",
            "matches_played": 0,
            "wins": 0,
            "losses": 0,
            "created_at": datetime.utcnow().isoformat()
        }

        players.append(player)
        save_players(players)
        return {"success": True, "message": f"Registered {username} successfully."}

    def update_stats(self, winner_discord_id: int, loser_discord_id: int):
        players = load_players()
        winner = next((p for p in players if p["discord_id"] == winner_discord_id), None)
        loser = next((p for p in players if p["discord_id"] == loser_discord_id), None)

        if winner:
            winner["wins"] = winner.get("wins", 0) + 1
            winner["matches_played"] = winner.get("matches_played", 0) + 1
            winner["xp"] = winner.get("xp", 0) + 10  # example XP gain

        if loser:
            loser["losses"] = loser.get("losses", 0) + 1
            loser["matches_played"] = loser.get("matches_played", 0) + 1
            loser["xp"] = loser.get("xp", 0) + 2  # consolation XP

        save_players(players)

    def get_player(self, discord_id: int):
        players = load_players()
        return next((p for p in players if p["discord_id"] == discord_id), None)

    def get_all_players(self):
        return load_players()


player_service = PlayerService()


