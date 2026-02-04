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
        team="Choose your starting team"
    )
    @app_commands.choices(team=[
        app_commands.Choice(name="Red", value="red"),
        app_commands.Choice(name="Blue", value="blue"),
        app_commands.Choice(name="Green", value="green"),
        app_commands.Choice(name="Yellow", value="yellow"),
        app_commands.Choice(name="Purple", value="purple"),
        app_commands.Choice(name="Orange", value="orange")
    ])
    async def register(
        self,
        interaction: discord.Interaction,
        username: str,
        team: app_commands.Choice[str]
    ):
        discord_id = interaction.user.id
        print(f"🔹 /register called by {interaction.user} ({discord_id}) — Username: {username}, Team: {team.value}")

        try:
            result = player_service.register_player(discord_id, username, team.value)

            if result["success"]:
                try:
                    sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
                    print("✅ players.json synced to GitHub")
                except Exception as e:
                    print(f"❌ syncToSite failed: {e}")

                await interaction.response.send_message(
                    f"🎉 Welcome **{username}**! You have joined the **{team.value}** team.",
                    ephemeral=True
                )
                return

            print(f"⚠️ Registration failed for {discord_id}: {result['message']}")
            await interaction.response.send_message(
                f"⚠️ {result['message']}", ephemeral=True
            )

        except Exception as e:
            print(f"❌ /register error for {discord_id}: {e}")
            await interaction.response.send_message(
                "❌ Something went wrong during registration.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(Register(bot))


