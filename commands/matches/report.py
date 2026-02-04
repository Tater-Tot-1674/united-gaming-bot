import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site
from utils.leaderboardCalc import calculate_leaderboard
from utils.rankSystem import update_rank
from datetime import datetime

MATCHES_PATH = DATA_PATHS["TOURNAMENTS"]
PLAYERS_PATH = DATA_PATHS["PLAYERS"]
GUILD_ID = 1335339358932304055

class ReportMatch(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="report",
        description="Report a match result"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(
        winner="Discord ID of the winner",
        loser="Discord ID of the loser"
    )
    async def report(self, interaction: discord.Interaction, winner: str, loser: str):
        print(f"🔹 /report called by {interaction.user} — Winner: {winner}, Loser: {loser}")

        # Load matches
        try:
            with open(MATCHES_PATH, "r", encoding="utf8") as f:
                matches = json.load(f)
            print("✅ Loaded matches.json")
        except Exception as e:
            print(f"❌ Failed to read matches.json: {e}")
            return await interaction.response.send_message(
                "⚠️ Error reading match data.", ephemeral=True
            )

        # Append new match
        match_entry = {
            "winner": winner,
            "loser": loser,
            "date": datetime.utcnow().isoformat()
        }
        matches.append(match_entry)
        print(f"✏️ Appended match: {match_entry}")

        # Save matches
        try:
            with open(MATCHES_PATH, "w", encoding="utf8") as f:
                json.dump(matches, f, indent=2)
            sync_to_site("tournaments.json", WEBSITE_REPO, GITHUB_TOKEN)
            print("✅ Saved matches.json and synced to GitHub")
        except Exception as e:
            print(f"❌ Failed to save matches.json: {e}")

        # Load players
        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
            print("✅ Loaded players.json")
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "⚠️ Error reading player data.", ephemeral=True
            )

        # Update leaderboard and ranks
        calculate_leaderboard()
        update_rank(players, winner)
        update_rank(players, loser)
        print("📊 Leaderboard and ranks updated")

        # Save players
        try:
            with open(PLAYERS_PATH, "w", encoding="utf8") as f:
                json.dump(players, f, indent=2)
            sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
            print("✅ Saved players.json and synced to GitHub")
        except Exception as e:
            print(f"❌ Failed to save players.json: {e}")

        await interaction.response.send_message(
            "✅ Match reported and leaderboard updated!", ephemeral=True
        )

async def setup(bot):
    await bot.add_cog(ReportMatch(bot))


