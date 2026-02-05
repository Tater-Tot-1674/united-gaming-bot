import discord
from discord import app_commands
from discord.ext import commands
from services.tournament_service import tournament_service

GUILD_ID = 1335339358932304055
AUTHORIZED_REPORTERS = [1035911200237699072]  # Only these Discord IDs can report matches

class ReportTournamentMatch(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="report_tournament_match",
        description="Report the winner of a tournament match"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(
        tournament_id="The ID of the tournament",
        winner_id="Discord ID of the winner",
        loser_id="Discord ID of the loser"
    )
    async def report_tournament_match(
        self,
        interaction: discord.Interaction,
        tournament_id: str,
        winner_id: str,
        loser_id: str
    ):
        if interaction.user.id not in AUTHORIZED_REPORTERS:
            await interaction.response.send_message(
                "⚠️ You are not authorized to report tournament matches.", ephemeral=True
            )
            return

        try:
            tournament = tournament_service.get_tournament(tournament_id)
            if not tournament:
                await interaction.response.send_message(
                    "⚠️ Tournament not found.", ephemeral=True
                )
                return

            # Record the match result in the tournament participants (basic implementation)
            result = tournament_service.record_match(tournament_id, winner_id, loser_id)
            if not result["success"]:
                await interaction.response.send_message(
                    f"⚠️ {result['message']}", ephemeral=True
                )
                return

            await interaction.response.send_message(
                f"✅ Match reported: <@{winner_id}> defeated <@{loser_id}> in **{tournament.get('name')}**.",
                ephemeral=False
            )

        except Exception as e:
            print(f"❌ /report_tournament_match error: {e}")
            await interaction.response.send_message(
                "❌ Something went wrong while reporting the match.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(ReportTournamentMatch(bot))

