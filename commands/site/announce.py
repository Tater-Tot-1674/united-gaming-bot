import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

ANNOUNCEMENTS_PATH = DATA_PATHS["ANNOUNCEMENTS"]
GUILD_ID = 1335339358932304055

class Announce(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="announce",
        description="Post an announcement to the site",
        guild=discord.Object(id=GUILD_ID)
    )
    @app_commands.describe(message="The announcement text")
    async def announce(self, interaction, message: str):
        username = interaction.user.name

        try:
            with open(ANNOUNCEMENTS_PATH, "r", encoding="utf8") as f:
                announcements = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read announcements.json: {e}")
            return await interaction.response.send_message(
                "Error reading announcements.",
                ephemeral=True
            )

        new_announcement = {
            "id": str(int(__import__("time").time() * 1000)),
            "author": username,
            "content": message,
            "date": __import__("datetime").datetime.utcnow().isoformat()
        }

        announcements.append(new_announcement)

        try:
            with open(ANNOUNCEMENTS_PATH, "w", encoding="utf8") as f:
                json.dump(announcements, f, indent=2)
            sync_to_site("announcements.json", WEBSITE_REPO, GITHUB_TOKEN)
        except Exception as e:
            print(f"❌ Failed to write announcements.json: {e}")

        return await interaction.response.send_message(
            "Announcement posted!",
            ephemeral=True
        )

async def setup(bot):
    await bot.add_cog(Announce(bot))


