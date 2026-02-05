import discord
from discord import app_commands
from discord.ext import commands
from services.player_service import player_service
from utils.syncToSite import sync_to_site
from utils.constants import WEBSITE_REPO, GITHUB_TOKEN

GUILD_ID = 1335339358932304055

class Register(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="register",
        description="Register as a new player in KartKings"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(
        username="Your in-game display name",
        team="Your team abbreviation (3 letters max, or N/A if no team)"
    )
    async def register(
        self,
        interaction: discord.Interaction,
        username: str,
        team: str
    ):
        discord_id = interaction.user.id
        team = team.strip().upper() if team else "N/A"

        # Limit to 3 characters max
        if len(team) > 3:
            await interaction.response.send_message(
                "⚠️ Team abbreviation must be 3 letters or less. Use N/A if no team.",
                ephemeral=False
            )
            return

        print(f"🔹 /register called by {interaction.user} ({discord_id}) — Username: {username}, Team: {team}")

        try:
            result = player_service.register_player(discord_id, username, team)

            if result["success"]:
                try:
                    sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
                    print("✅ players.json synced to GitHub")
                except Exception as e:
                    print(f"❌ syncToSite failed: {e}")

                await interaction.response.send_message(
                    f"🎉 Welcome **{username}**! Your team abbreviation is set to **{team}**.",
                    ephemeral=False
                )
                return

            print(f"⚠️ Registration failed for {discord_id}: {result['message']}")
            await interaction.response.send_message(
                f"⚠️ {result['message']}", ephemeral=False
            )

        except Exception as e:
            print(f"❌ /register error for {discord_id}: {e}")
            await interaction.response.send_message(
                "❌ Something went wrong during registration.", ephemeral=False
            )

async def setup(bot):
    await bot.add_cog(Register(bot))



