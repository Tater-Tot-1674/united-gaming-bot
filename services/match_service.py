import json
import time
from datetime import datetime
from utils.syncToSite import sync_to_site
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from services.player_service import player_service

MATCHES_PATH = DATA_PATHS["MATCHES"]


def load_matches():
    try:
        with open(MATCHES_PATH, "r", encoding="utf8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        print(f"❌ JSON error in matches file: {e}")
        return []


def save_matches(matches):
    with open(MATCHES_PATH, "w", encoding="utf8") as f:
        json.dump(matches, f, indent=2)

    sync_to_site("matches.json", WEBSITE_REPO, GITHUB_TOKEN)


class MatchService:
    def report_match(self, winner_discord_id: str, loser_discord_id: str):
        matches = load_matches()

        match = {
            "id": str(int(time.time() * 1000)),
            "winner": winner_discord_id,
            "loser": loser_discord_id,
            "date": datetime.utcnow().isoformat()
        }

        matches.append(match)
        save_matches(matches)

        # Update stats safely
        player_service.update_stats(winner_discord_id, loser_discord_id)

        return match

    def get_all_matches(self):
        return load_matches()


match_service = MatchService()

