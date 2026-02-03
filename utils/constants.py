import os

# -------------------------------------
# Environment Variables
# -------------------------------------

CLIENT_ID = os.getenv("BOTUSERID")            # Discord Application ID
DISCORD_TOKEN = os.getenv("DISCORDTOKEN")     # Discord Bot Token
WEBSITE_REPO = os.getenv("GITHUBREPO")        # GitHub repo URL
GITHUB_TOKEN = os.getenv("GITHUBTOKEN")       # GitHub Personal Access Token
RENDER_URL = os.getenv("RENDERSERVICEURL")    # Render service URL

# -------------------------------------
# Paths to JSON Data
# -------------------------------------

DATA_PATHS = {
    "PLAYERS": "data/players.json",
    "TOURNAMENTS": "data/tournaments.json",
    "ANNOUNCEMENTS": "data/announcements.json",
    "BRACKET": "data/bracket.json",
    "LEADERBOARD_WEEKLY": "data/leaderboardweekly.json",
    "LEADERBOARD_MONTHLY": "data/leaderboardmonthly.json"
}

# -------------------------------------
# Leaderboard Types
# -------------------------------------

LEADERBOARD_TYPES = {
    "WEEKLY": "weekly",
    "MONTHLY": "monthly"
}

# -------------------------------------
# Default Discord Roles or IDs
# -------------------------------------

DEFAULT_ROLES = {
    "ADMIN": "admin-role-id",
    "MODERATOR": "moderator-role-id"
}

# -------------------------------------
# Other Static Settings
# -------------------------------------

BOT_SETTINGS = {
    "PREFIX": "!",
    "MAX_PLAYERS": 100
}
