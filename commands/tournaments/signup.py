# signup.py
import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

TOURNAMENTS_PATH = DATA_PATHS["TOURNAMENTS"]

class Signup(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="signup",
        description="Sign up for a tournament"
    )
    @app_commands.describe(tournament_id="The ID of the tournament")
    async def signup(self, interaction: discord.Interaction, tournament_id: str):
        user_id = str(interaction.user.id)

        try:
            with open(TOURNAMENTS_PATH, "r", encoding="utf8") as f:
                tournaments = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read tournaments.json: {e}")
            return await interaction.response.send_message("Error reading tournament data.", ephemeral=True)

        tournament = next((t for t in tournaments if t.get("id") == tournament_id), None)
        if not tournament:
            return await interaction.response.send_message("Tournament not found.", ephemeral=True)

        tournament.setdefault("participants", [])
        if user_id in tournament["participants"]:
            return await interaction.response.send_message("You are already signed up!", ephemeral=True)

        tournament["participants"].append(user_id)

        try:
            with open(TOURNAMENTS_PATH, "w", encoding="utf8") as f:
                json.dump(tournaments, f, indent=2)
            sync_to_site("tournaments.json", WEBSITE_REPO, GITHUB_TOKEN)
        except Exception as e:
            print(f"❌ Failed to write tournaments.json: {e}")

        await interaction.response.send_message(f"🎉 You have joined **{tournament.get('name')}**!", ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Signup(bot))

