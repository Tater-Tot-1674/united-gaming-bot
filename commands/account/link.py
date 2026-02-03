import json
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

PLAYERS_PATH = DATA_PATHS["PLAYERS"]

class Link(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="link", description="Link your Discord account to a player")
    @app_commands.describe(player_tag="Your in‑game player tag")
    async def link(self, interaction, player_tag: str):
        discord_id = interaction.user.id

        # Load players
        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "There was an error reading player data.",
                ephemeral=True
            )

        # Already linked?
        if any(p.get("discordId") == discord_id for p in players):
            return await interaction.response.send_message(
                "Your account is already linked!",
                ephemeral=True
            )

        # Find player by tag
        player = next((p for p in players if p.get("username") == player_tag), None)
        if not player:
            return await interaction.response.send_message(
                "Player not found.",
                ephemeral=True
            )

        # Link account
        player["discordId"] = discord_id

        try:
            with open(PLAYERS_PATH, "w", encoding="utf8") as f:
                json.dump(players, f, indent=2)
        except Exception as e:
            print(f"❌ Failed to write players.json: {e}")
            return await interaction.response.send_message(
                "There was an error saving your link.",
                ephemeral=True
            )

        # Sync to GitHub
        try:
            sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
        except Exception as e:
            print(f"❌ syncToSite failed: {e}")

        return await interaction.response.send_message(
            f"Successfully linked to **{player['username']}**!",
            ephemeral=True
        )

async def setup(bot):
    await bot.add_cog(Link(bot))

