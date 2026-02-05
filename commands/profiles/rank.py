# rank.py
import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS

LEADERBOARD_PATH = DATA_PATHS["LEADERBOARD_WEEKLY"]

class Rank(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="rank",
        description="View the weekly leaderboard"
    )
    async def rank(self, interaction: discord.Interaction):
        try:
            with open(LEADERBOARD_PATH, "r", encoding="utf8") as f:
                leaderboard = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read leaderboard: {e}")
            await interaction.response.send_message(
                "Error loading leaderboard.",
                ephemeral=False
            )
            return

        top_players = "\n".join(
            f"{i+1}. {p.get('username', 'Unknown')} — {p.get('points', 0)} pts"
            for i, p in enumerate(leaderboard[:10])
        )

        await interaction.response.send_message(
            f"🏆 **Weekly Leaderboard:**\n{top_players}",
            ephemeral=False
        )

async def setup(bot: commands.Bot):
    await bot.add_cog(Rank(bot))
