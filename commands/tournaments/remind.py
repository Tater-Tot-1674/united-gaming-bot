# remind.py
import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS

TOURNAMENTS_PATH = DATA_PATHS["TOURNAMENTS"]

class Remind(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="remind",
        description="Remind participants of a tournament"
    )
    @app_commands.describe(tournament_id="The ID of the tournament")
    async def remind(self, interaction: discord.Interaction, tournament_id: str):
        try:
            with open(TOURNAMENTS_PATH, "r", encoding="utf8") as f:
                tournaments = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read tournaments.json: {e}")
            return await interaction.response.send_message("Error reading tournament data.", ephemeral=True)

        tournament = next((t for t in tournaments if t.get("id") == tournament_id), None)
        if not tournament:
            return await interaction.response.send_message("Tournament not found.", ephemeral=True)

        participants = tournament.get("participants", [])
        mentions = " ".join(f"<@{pid}>" for pid in participants)

        await interaction.response.send_message(f"⏰ **Reminder:** {tournament.get('name')} starts soon!\n{mentions}", ephemeral=False)

async def setup(bot: commands.Bot):
    await bot.add_cog(Remind(bot))
