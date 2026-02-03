import json
from utils.syncToSite import sync_to_site
from utils.bracketGen import generate_bracket
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN

tournaments_path = DATA_PATHS["TOURNAMENTS"]
bracket_path = DATA_PATHS["BRACKET"]

def load_tournaments():
    try:
        with open(tournaments_path, "r", encoding="utf8") as f:
            return json.load(f)
    except:
        return []

def save_tournaments(tournaments):
    with open(tournaments_path, "w", encoding="utf8") as f:
        json.dump(tournaments, f, indent=2)
    sync_to_site("tournaments.json", WEBSITE_REPO, GITHUB_TOKEN)

class TournamentService:
    def signup(self, tournament_id, user_id):
        tournaments = load_tournaments()
        tournament = next((t for t in tournaments if t.get("id") == tournament_id), None)

        if not tournament:
            return {"success": False, "message": "Tournament not found."}

        tournament.setdefault("participants", [])

        if user_id in tournament["participants"]:
            return {"success": False, "message": "Already signed up."}

        tournament["participants"].append(user_id)
        save_tournaments(tournaments)

        return {"success": True, "name": tournament.get("name")}

    def generate_bracket(self, tournament_id):
        tournaments = load_tournaments()
        tournament = next((t for t in tournaments if t.get("id") == tournament_id), None)

        if not tournament:
            return None

        bracket = generate_bracket(tournament.get("participants", []))

        with open(bracket_path, "w", encoding="utf8") as f:
            json.dump(bracket, f, indent=2)

        sync_to_site("bracket.json", WEBSITE_REPO, GITHUB_TOKEN)

        return tournament.get("name")

    def get_tournament(self, tournament_id):
        tournaments = load_tournaments()
        return next((t for t in tournaments if t.get("id") == tournament_id), None)

tournament_service = TournamentService()
