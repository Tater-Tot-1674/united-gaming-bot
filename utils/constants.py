import os

CLIENT_ID = os.getenv("BOTUSERID")
DISCORD_TOKEN = os.getenv("DISCORDTOKEN")
WEBSITE_REPO = os.getenv("GITHUBREPO")
GITHUB_TOKEN = os.getenv("GITHUBTOKEN")
RENDER_URL = os.getenv("RENDERSERVICEURL")

DATA_PATHS = {
    "PLAYERS": "data/players.json",
    "MATCHES": "data/matches.json",
    "TOURNAMENTS": "data/tournaments.json",
    "ANNOUNCEMENTS": "data/announcements.json",
    "BRACKET": "data/bracket.json",
    "LEADERBOARD_WEEKLY": "data/leaderboardweekly.json",
    "LEADERBOARD_MONTHLY": "data/leaderboardmonthly.json"
}

LEADERBOARD_TYPES = {"WEEKLY": "weekly", "MONTHLY": "monthly"}

DEFAULT_ROLES = {"ADMIN": "admin-role-id", "MODERATOR": "moderator-role-id"}

BOT_SETTINGS = {"PREFIX": "!", "MAX_PLAYERS": 100}
