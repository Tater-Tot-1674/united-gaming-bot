# start.py
import discord
from discord import app_commands
from discord.ext import commands

class Start(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="start",
        description="Get started with KartKings"
    )
    async def start(self, interaction: discord.Interaction):
        text = (
            "🏁 **Getting Started:**\n"
            "1. `/register` → Create your player profile\n"
            "2. `/quickplay` → Join a match\n"
            "3. `/profile` → Check your stats\n"
            "4. `/signup` → Enter tournaments\n\n"
            "Follow these steps and start climbing the ranks!"
        )
        await interaction.response.send_message(text, ephemeral=True)

async def setup(bot: commands.Bot):
    await bot.add_cog(Start(bot))

