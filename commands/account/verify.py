import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

PLAYERS_PATH = DATA_PATHS["PLAYERS"]
GUILD_ID = 1335339358932304055

class Verify(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="verify",
        description="Verify your account"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(code="Your verification code")
    async def verify(self, interaction: discord.Interaction, code: str):
        user_id = interaction.user.id
        print(f"🔹 /verify called by {interaction.user} ({user_id}) with code: {code}")

        # Load players
        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
            print("✅ Loaded players.json successfully")
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "⚠️ There was an error reading player data.",
                ephemeral=False
            )

        # Find player by Discord ID
        player = next((p for p in players if p.get("id") == str(user_id)), None)
        if not player:
            print(f"⚠️ User {user_id} not registered")
            return await interaction.response.send_message(
                "You need to register first!",
                ephemeral=False
            )

        if player.get("verified"):
            print(f"⚠️ User {user_id} already verified")
            return await interaction.response.send_message(
                "You are already verified!",
                ephemeral=False
            )

        if player.get("verificationCode") != code:
            print(f"⚠️ User {user_id} entered invalid code")
            return await interaction.response.send_message(
                "Invalid verification code.",
                ephemeral=False 
            )

        # Mark verified
        player["verified"] = True

        # Save changes
        try:
            with open(PLAYERS_PATH, "w", encoding="utf8") as f:
                json.dump(players, f, indent=2)
            print(f"✅ User {user_id} verified successfully")
        except Exception as e:
            print(f"❌ Failed to write players.json: {e}")
            return await interaction.response.send_message(
                "⚠️ There was an error saving your verification.",
                ephemeral=False
            )

        # Sync to GitHub
        try:
            sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
            print("✅ players.json synced to GitHub successfully")
        except Exception as e:
            print(f"❌ syncToSite failed: {e}")

        return await interaction.response.send_message(
            "✅ Account verified successfully!",
            ephemeral=False
        )

async def setup(bot):
    await bot.add_cog(Verify(bot))

