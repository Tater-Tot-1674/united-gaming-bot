import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site
from utils.leaderboardCalc import calculate_leaderboard
from utils.rankSystem import update_rank

MATCHES_PATH = DATA_PATHS["TOURNAMENTS"]
PLAYERS_PATH = DATA_PATHS["PLAYERS"]

GUILD_ID = 1335339358932304055

class ReportMatch(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="report",
        description="Report a match result",
        guild=discord.Object(id=GUILD_ID)   # ⭐ THIS makes it instant
    )
    @app_commands.describe(
        winner="Discord ID of the winner",
        loser="Discord ID of the loser"
    )
    async def report(self, interaction, winner: str, loser: str):

        # Load matches
        try:
            with open(MATCHES_PATH, "r", encoding="utf8") as f:
                matches = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read matches.json: {e}")
            return await interaction.response.send_message(
                "Error reading match data.",
                ephemeral=True
            )

        matches.append({
            "winner": winner,
            "loser": loser,
            "date": __import__("datetime").datetime.utcnow().isoformat()
        })

        # Save matches
        try:
            with open(MATCHES_PATH, "w", encoding="utf8") as f:
                json.dump(matches, f, indent=2)
            sync_to_site("tournaments.json", WEBSITE_REPO, GITHUB_TOKEN)
        except Exception as e:
            print(f"❌ Failed to write matches.json: {e}")

        # Load players
        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "Error reading player data.",
                ephemeral=True
            )

        # Update leaderboard
        calculate_leaderboard()

        # Update ranks
        update_rank(players, winner)
        update_rank(players, loser)

        # Save players
        try:
            with open(PLAYERS_PATH, "w", encoding="utf8") as f:
                json.dump(players, f, indent=2)
            sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
        except Exception as e:
            print(f"❌ Failed to write players.json: {e}")

        return await interaction.response.send_message(
            "Match reported and leaderboard updated!",
            ephemeral=True
        )

async def setup(bot):
    await bot.add_cog(ReportMatch(bot))

