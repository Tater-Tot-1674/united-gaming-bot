import discord
from discord import app_commands
from discord.ext import commands

GUILD_ID = 1335339358932304055

class HelpMenu(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="help",
        description="Show all available commands and how to use them",
        guild=discord.Object(id=GUILD_ID)
    )
    async def help(self, interaction):
        text = (
            "🆘 **Help Menu:**\n"
            "- `/register` → Create your profile\n"
            "- `/profile` → View your stats\n"
            "- `/signup` → Join a tournament\n"
            "- `/report` → Report a match\n"
            "- `/leaderboard` → View rankings\n"
            "- `/announce` → Admin announcements"
        )

        await interaction.response.send_message(text, ephemeral=True)

async def setup(bot):
    await bot.add_cog(HelpMenu(bot))

