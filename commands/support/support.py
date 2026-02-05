# support.py
import discord
from discord import app_commands
from discord.ext import commands

class Support(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="support",
        description="Get help from the KartKings team"
    )
    async def support(self, interaction: discord.Interaction):
        text = (
            "📞 **Support Info:**\n"
            "- Contact a moderator on Discord for urgent issues.\n"
            "- Use `/help` for a full list of commands.\n"
            "- Check `/faq` for common questions.\n\n"
            "We’re here to help you dominate the arena!"
        )
        await interaction.response.send_message(text, ephemeral=False)

async def setup(bot: commands.Bot):
    await bot.add_cog(Support(bot))
