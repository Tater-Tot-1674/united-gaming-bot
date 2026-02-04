# bracket.py
import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.bracketGen import generate_bracket
from utils.syncToSite import sync_to_site

TOURNAMENTS_PATH = DATA_PATHS["TOURNAMENTS"]
BRACKET_PATH = DATA_PATHS["BRACKET"]

class Bracket(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="bracket",
        description="Generate tournament bracket"
    )
    @app_commands.describe(tournament_id="The ID of the tournament")
    async def bracket(self, interaction: discord.Interaction, tournament_id: str):
        try:
            with open(TOURNAMENTS_PATH, "r", encoding="utf8") as f:
                tournaments = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read tournaments.json: {e}")
            return await interaction.response.send_message("Error reading tournament data.", ephemeral=True)

        tournament = next((t for t in tournaments if t.get("id") == tournament_id), None)
        if not tournament:
            return await interaction.response.send_message("Tournament not found.", ephemeral=True)

        bracket = generate_bracket(tournament.get("participants", []))

        try:
            with open(BRACKET_PATH, "w", encoding="utf8") as f:
                json.dump(bracket, f, indent=2)
            sync_to_site("bracket.json", WEBSITE_REPO, GITHUB_TOKEN)
        except Exception as e:
            print(f"❌ Failed to write bracket.json: {e}")

        await interaction.response.send_message(f"Bracket for **{tournament.get('name')}** generated!", ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Bracket(bot))
