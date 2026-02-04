import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS

PLAYERS_PATH = DATA_PATHS["PLAYERS"]
GUILD_ID = 1335339358932304055

class Rival(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="rival",
        description="View your top rivals",
        guild=discord.Object(id=GUILD_ID)
    )
    async def rival(self, interaction):
        user_id = str(interaction.user.id)

        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "Error loading player data.",
                ephemeral=True
            )

        me = next((p for p in players if p.get("id") == user_id), None)
        if not me:
            return await interaction.response.send_message(
                "You are not registered.",
                ephemeral=True
            )

        rivals = sorted(
            (p for p in players if p.get("id") != user_id),
            key=lambda p: p.get("points", 0),
            reverse=True
        )[:3]

        if not rivals:
            return await interaction.response.send_message(
                "No rivals found.",
                ephemeral=True
            )

        rival_text = "\n".join(
            f"{p.get('name')} — {p.get('points', 0)} pts"
            for p in rivals
        )

        return await interaction.response.send_message(
            f"⚔️ **Your Top Rivals:**\n{rival_text}",
            ephemeral=False
        )

async def setup(bot):
    await bot.add_cog(Rival(bot))




