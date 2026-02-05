# announce.py
import json
import time
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site
from datetime import datetime

ANNOUNCEMENTS_PATH = DATA_PATHS["ANNOUNCEMENTS"]

class Announce(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(
        name="announce",
        description="Post an announcement to the site"
    )
    @app_commands.describe(message="The announcement text")
    async def announce(self, interaction: discord.Interaction, message: str):
        username = interaction.user.name

        try:
            with open(ANNOUNCEMENTS_PATH, "r", encoding="utf8") as f:
                announcements = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read announcements.json: {e}")
            await interaction.response.send_message(
                "Error reading announcements.",
                ephemeral=False
            )
            return

        new_announcement = {
            "id": str(int(time.time() * 1000)),
            "author": username,
            "content": message,
            "date": datetime.utcnow().isoformat()
        }

        announcements.append(new_announcement)

        try:
            with open(ANNOUNCEMENTS_PATH, "w", encoding="utf8") as f:
                json.dump(announcements, f, indent=2)
            try:
                sync_to_site("announcements.json", WEBSITE_REPO, GITHUB_TOKEN)
            except Exception as e:
                print(f"❌ syncToSite failed: {e}")
        except Exception as e:
            print(f"❌ Failed to write announcements.json: {e}")

        await interaction.response.send_message(
            "Announcement posted!",
            ephemeral=False
        )

async def setup(bot: commands.Bot):
    await bot.add_cog(Announce(bot))


