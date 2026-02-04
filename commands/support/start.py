import discord
from discord import app_commands
from discord.ext import commands

GUILD_ID = 1335339358932304055

class Start(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="start",
        description="Get started with KartKings",
        guild=discord.Object(id=GUILD_ID)
    )
    async def start(self, interaction):
        text = (
            "🏁 **Getting Started:**\n"
            "1. `/register` → Create your player profile\n"
            "2. `/quickplay` → Join a match\n"
            "3. `/profile` → Check your stats\n"
            "4. `/signup` → Enter tournaments\n\n"
            "Follow these steps and start climbing the ranks!"
        )

        await interaction.response.send_message(text, ephemeral=True)

async def setup(bot):
    await bot.add_cog(Start(bot))

