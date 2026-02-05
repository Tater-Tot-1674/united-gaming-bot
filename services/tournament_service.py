import json
import time
from datetime import datetime
from utils.syncToSite import sync_to_site
from utils.bracketGen import generate_bracket
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN

TOURNAMENTS_PATH = DATA_PATHS["TOURNAMENTS"]
BRACKET_PATH = DATA_PATHS["BRACKET"]
MATCHES_PATH = DATA_PATHS["MATCHES"]  # optional if you track matches separately


def load_json(path):
    try:
        with open(path, "r", encoding="utf8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError as e:
        print(f"❌ JSON error in {path}: {e}")
        return []


def save_json(path, data):
    with open(path, "w", encoding="utf8") as f:
        json.dump(data, f, indent=2)


class TournamentService:
    def load_tournaments(self):
        return load_json(TOURNAMENTS_PATH)

    def save_tournaments(self, tournaments):
        save_json(TOURNAMENTS_PATH, tournaments)
        sync_to_site("tournaments.json", WEBSITE_REPO, GITHUB_TOKEN)

    def get_tournament(self, tournament_id: str):
        tournaments = self.load_tournaments()
        return next((t for t in tournaments if t.get("id") == tournament_id), None)

    def signup(self, tournament_id: str, user_id: str):
        tournaments = self.load_tournaments()
        tournament = self.get_tournament(tournament_id)
        if not tournament:
            return {"success": False, "message": "Tournament not found."}

        tournament.setdefault("participants", [])

        if user_id in tournament["participants"]:
            return {"success": False, "message": "Already signed up."}

        tournament["participants"].append(user_id)
        self.save_tournaments(tournaments)
        return {"success": True, "name": tournament.get("name")}

    def generate_bracket(self, tournament_id: str):
        tournament = self.get_tournament(tournament_id)
        if not tournament:
            return None

        participants = tournament.get("participants", [])
        bracket = generate_bracket(participants)

        save_json(BRACKET_PATH, bracket)
        sync_to_site("bracket.json", WEBSITE_REPO, GITHUB_TOKEN)

        return tournament.get("name")

    def record_match(self, tournament_id: str, winner_id: str, loser_id: str):
        """
        Records a match in a tournament. Returns success status.
        """
        tournaments = self.load_tournaments()
        tournament = next((t for t in tournaments if t.get("id") == tournament_id), None)
        if not tournament:
            return {"success": False, "message": "Tournament not found."}

        tournament.setdefault("matches", [])

        # Optional: prevent duplicate matches
        existing = next(
            (m for m in tournament["matches"] if m["winner"] == winner_id and m["loser"] == loser_id),
            None
        )
        if existing:
            return {"success": False, "message": "This match has already been reported."}

        match = {
            "id": str(int(time.time() * 1000)),
            "winner": winner_id,
            "loser": loser_id,
            "date": datetime.utcnow().isoformat()
        }

        tournament["matches"].append(match)
        self.save_tournaments(tournaments)

        # Update the bracket after the match (optional advanced logic)
        self.update_bracket(tournament)

        return {"success": True, "match": match}

    def update_bracket(self, tournament):
        """
        Regenerate the bracket from current participants and reported matches.
        """
        participants = tournament.get("participants", [])
        bracket = generate_bracket(participants)

        # Apply results from reported matches
        for match in tournament.get("matches", []):
            for b in bracket:
                if b["player1"] == match["winner"] or b["player2"] == match["winner"]:
                    b["winner"] = match["winner"]

        save_json(BRACKET_PATH, bracket)
        sync_to_site("bracket.json", WEBSITE_REPO, GITHUB_TOKEN)


# Singleton instance
tournament_service = TournamentService()

