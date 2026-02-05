# rival.py
import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS

PLAYERS_PATH = DATA_PATHS["PLAYERS"]

class Rival(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="rival",
        description="View your top rivals"
    )
    async def rival(self, interaction: discord.Interaction):
        user_id = str(interaction.user.id)

        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            await interaction.response.send_message(
                "Error loading player data.",
                ephemeral=False
            )
            return

        me = next((p for p in players if p.get("id") == user_id), None)
        if not me:
            await interaction.response.send_message(
                "You are not registered.",
                ephemeral=False
            )
            return

        rivals = sorted(
            (p for p in players if p.get("id") != user_id),
            key=lambda p: p.get("points", 0),
            reverse=True
        )[:3]

        if not rivals:
            await interaction.response.send_message(
                "No rivals found.",
                ephemeral=False
            )
            return

        rival_text = "\n".join(
            f"{p.get('username', 'Unknown')} — {p.get('points', 0)} pts"
            for p in rivals
        )

        await interaction.response.send_message(
            f"⚔️ **Your Top Rivals:**\n{rival_text}",
            ephemeral=False
        )

async def setup(bot: commands.Bot):
    await bot.add_cog(Rival(bot))
