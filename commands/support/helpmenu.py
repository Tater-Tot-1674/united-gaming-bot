# helpmenu.py
import discord
from discord import app_commands
from discord.ext import commands

class HelpMenu(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="help",
        description="Show all available commands and how to use them"
    )
    async def help(self, interaction: discord.Interaction):
        text = (
            "🆘 **Help Menu:**\n"
            "- `/register` → Create your profile\n"
            "- `/profile` → View your stats\n"
            "- `/signup` → Join a tournament\n"
            "- `/report` → Report a match\n"
            "- `/leaderboard` → View rankings\n"
            "- `/announce` → Admin announcements"
        )
        await interaction.response.send_message(text, ephemeral=False)

async def setup(bot: commands.Bot):
    await bot.add_cog(HelpMenu(bot))
