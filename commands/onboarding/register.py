from discord import app_commands
from discord.ext import commands
from services.player_service import player_service
from utils.syncToSite import sync_to_site
from utils.constants import WEBSITE_REPO, GITHUB_TOKEN

class Register(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="register", description="Register as a new player in KartKings")
    @app_commands.describe(
        username="Your in‑game display name",
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
    async def register(self, interaction, username: str, team: app_commands.Choice[str]):

        try:
            result = player_service.register_player(
                interaction.user.id,
                username,
                team.value
            )

            if result["success"]:
                try:
                    sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
                except Exception as e:
                    print(f"❌ syncToSite failed: {e}")

                return await interaction.response.send_message(
                    f"🎉 Welcome **{username}**! You have joined the **{team.value}** team.",
                    ephemeral=True
                )

            return await interaction.response.send_message(
                f"⚠️ {result['message']}",
                ephemeral=True
            )

        except Exception as e:
            print(f"❌ Error registering player: {e}")
            return await interaction.response.send_message(
                "❌ Something went wrong during registration.",
                ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(Register(bot))

