import json
from utils.syncToSite import sync_to_site
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN

players_path = DATA_PATHS["PLAYERS"]

def load_players():
    try:
        with open(players_path, "r", encoding="utf8") as f:
            return json.load(f)
    except:
        return []

def save_players(players):
    with open(players_path, "w", encoding="utf8") as f:
        json.dump(players, f, indent=2)
    sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)

class PlayerService:
    def get_all_players(self):
        return load_players()

    def get_player_by_discord(self, discord_id):
        players = load_players()
        return next((p for p in players if p.get("discordId") == discord_id), None)

    def get_player_by_name(self, name):
        players = load_players()
        return next((p for p in players if p.get("name", "").lower() == name.lower()), None)

    def register_player(self, discord_id, username, team):
        players = load_players()

        if any(p.get("discordId") == discord_id for p in players):
            return {"success": False, "message": "You are already registered."}

        new_player = {
            "id": str(int(__import__("time").time() * 1000)),
            "discordId": discord_id,
            "name": username,
            "team": team,
            "xp": 0,
            "wins": 0,
            "losses": 0,
            "rank": "Rookie",
            "verified": False
        }

        players.append(new_player)
        save_players(players)

        return {"success": True}

    def update_stats(self, winner_id, loser_id):
        players = load_players()

        winner = next((p for p in players if p.get("discordId") == winner_id), None)
        loser = next((p for p in players if p.get("discordId") == loser_id), None)

        if not winner or not loser:
            return

        winner["wins"] += 1
        winner["xp"] += 25

        loser["losses"] += 1
        loser["xp"] += 10

        save_players(players)

player_service = PlayerService()

