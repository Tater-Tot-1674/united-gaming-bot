import discord
from discord import app_commands
from discord.ext import commands
from services.tournament_service import tournament_service

GUILD_ID = 1335339358932304055

class SignupTournament(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="signup_tournament",
        description="Sign up for a tournament"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(
        tournament_id="The ID of the tournament you want to join"
    )
    async def signup_tournament(self, interaction: discord.Interaction, tournament_id: str):
        user_id = str(interaction.user.id)

        try:
            result = tournament_service.signup(tournament_id, user_id)

            if result["success"]:
                await interaction.response.send_message(
                    f"✅ You are now signed up for **{result['name']}**!", ephemeral=False
                )
            else:
                await interaction.response.send_message(
                    f"⚠️ {result['message']}", ephemeral=True
                )

        except Exception as e:
            print(f"❌ /signup_tournament error: {e}")
            await interaction.response.send_message(
                "❌ Something went wrong while signing up.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(SignupTournament(bot))
