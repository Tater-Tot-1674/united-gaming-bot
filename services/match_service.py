import json
import os
from utils.syncToSite import sync_to_site
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from services.player_service import player_service

matches_path = DATA_PATHS["TOURNAMENTS"]

def load_matches():
    try:
        with open(matches_path, "r", encoding="utf8") as f:
            return json.load(f)
    except:
        return []

def save_matches(matches):
    with open(matches_path, "w", encoding="utf8") as f:
        json.dump(matches, f, indent=2)
    sync_to_site("tournaments.json", WEBSITE_REPO, GITHUB_TOKEN)

class MatchService:
    def report_match(self, winner_discord_id, loser_discord_id):
        matches = load_matches()

        matches.append({
            "id": str(int(__import__("time").time() * 1000)),
            "winner": winner_discord_id,
            "loser": loser_discord_id,
            "date": __import__("datetime").datetime.utcnow().isoformat()
        })

        save_matches(matches)

        # Update player stats
        player_service.update_stats(winner_discord_id, loser_discord_id)

    def get_all_matches(self):
        return load_matches()

match_service = MatchService()
