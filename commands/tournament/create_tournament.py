import discord
from discord import app_commands
from discord.ext import commands
from services.tournament_service import tournament_service

# Only these users can create tournaments
ALLOWED_CREATORS = [1035911200237699072]

GUILD_ID = 1335339358932304055

class CreateTournament(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="create_tournament",
        description="Create a new tournament (restricted users only)"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(
        name="The name of the tournament"
    )
    async def create_tournament(self, interaction: discord.Interaction, name: str):
        if interaction.user.id not in ALLOWED_CREATORS:
            await interaction.response.send_message(
                "❌ You are not authorized to create tournaments.", ephemeral=True
            )
            return

        try:
            import time
            tournament_id = str(int(time.time() * 1000))

            tournaments = tournament_service.load_tournaments()
            tournaments.append({
                "id": tournament_id,
                "name": name,
                "participants": []
            })

            tournament_service.save_tournaments(tournaments)

            await interaction.response.send_message(
                f"🏆 Tournament **{name}** created with ID `{tournament_id}`.",
                ephemeral=False
            )
        except Exception as e:
            print(f"❌ /create_tournament error: {e}")
            await interaction.response.send_message(
                "❌ Failed to create tournament.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(CreateTournament(bot))
