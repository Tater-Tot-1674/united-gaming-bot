import json
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS

TOURNAMENTS_PATH = DATA_PATHS["TOURNAMENTS"]

GUILD_ID = 1335339358932304055

class Remind(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="remind",
        description="Remind participants of a tournament"
    )
    @app_commands.describe(tournament_id="The ID of the tournament")
    async def remind(self, interaction, tournament_id: str):

        # Load tournaments
        try:
            with open(TOURNAMENTS_PATH, "r", encoding="utf8") as f:
                tournaments = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read tournaments.json: {e}")
            return await interaction.response.send_message(
                "Error reading tournament data.",
                ephemeral=True
            )

        tournament = next((t for t in tournaments if t.get("id") == tournament_id), None)
        if not tournament:
            return await interaction.response.send_message(
                "Tournament not found.",
                ephemeral=True
            )

        participants = tournament.get("participants", [])
        mentions = " ".join(f"<@{pid}>" for pid in participants)

        return await interaction.response.send_message(
            f"⏰ **Reminder:** {tournament.get('name')} starts soon!\n{mentions}",
            ephemeral=False
        )

async def setup(bot):
    await bot.add_cog(Remind(bot))

