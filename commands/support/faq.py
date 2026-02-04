from discord import app_commands
from discord.ext import commands

GUILD_ID = 1335339358932304055

class FAQ(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="faq",
        description="View frequently asked questions"
    )
    async def faq(self, interaction):
        text = (
            "📚 **FAQ Overview:**\n"
            "- `/faq-general` → General questions\n"
            "- `/faq-matches` → Match rules & reporting\n"
            "- `/faq-tournaments` → Tournament questions\n"
            "- `/faq-account` → Account & profile questions"
        )

        await interaction.response.send_message(text, ephemeral=True)

async def setup(bot):
    await bot.add_cog(FAQ(bot))
