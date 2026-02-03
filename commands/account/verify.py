import json
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

PLAYERS_PATH = DATA_PATHS["PLAYERS"]

class Verify(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="verify", description="Verify your account")
    @app_commands.describe(code="Your verification code")
    async def verify(self, interaction, code: str):
        user_id = interaction.user.id

        # Load players
        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "There was an error reading player data.",
                ephemeral=True
            )

        # Find player
        player = next((p for p in players if p.get("id") == str(user_id)), None)

        if not player:
            return await interaction.response.send_message(
                "You need to register first!",
                ephemeral=True
            )

        if player.get("verified"):
            return await interaction.response.send_message(
                "You are already verified!",
                ephemeral=True
            )

        if player.get("verificationCode") != code:
            return await interaction.response.send_message(
                "Invalid verification code.",
                ephemeral=True
            )

        # Mark verified
        player["verified"] = True

        # Save
        try:
            with open(PLAYERS_PATH, "w", encoding="utf8") as f:
                json.dump(players, f, indent=2)
        except Exception as e:
            print(f"❌ Failed to write players.json: {e}")
            return await interaction.response.send_message(
                "There was an error saving your verification.",
                ephemeral=True
            )

        # Sync to GitHub
        try:
            sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
        except Exception as e:
            print(f"❌ syncToSite failed: {e}")

        return await interaction.response.send_message(
            "Account verified successfully!",
            ephemeral=True
        )

async def setup(bot):
    await bot.add_cog(Verify(bot))

