import discord
from discord import app_commands
from discord.ext import commands
from services.tournament_service import tournament_service
from services.match_service import match_service

GUILD_ID = 1335339358932304055

class ReportTournamentMatch(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="report_tournament_match",
        description="Report the result of a tournament match"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(
        tournament_id="The ID of the tournament",
        winner="Winner's Discord mention",
        loser="Loser's Discord mention"
    )
    async def report_tournament_match(
        self,
        interaction: discord.Interaction,
        tournament_id: str,
        winner: discord.Member,
        loser: discord.Member
    ):
        try:
            tournament = tournament_service.get_tournament(tournament_id)
            if not tournament:
                await interaction.response.send_message(
                    "❌ Tournament not found.", ephemeral=True
                )
                return

            participants = tournament.get("participants", [])
            if winner.id not in participants or loser.id not in participants:
                await interaction.response.send_message(
                    "❌ Both players must be signed up for this tournament.", ephemeral=True
                )
                return

            # Update bracket
            tournament_service.generate_bracket(tournament_id)

            # Report match in matches.json
            match_service.report_match(str(winner.id), str(loser.id))

            await interaction.response.send_message(
                f"✅ Match reported: {winner.display_name} defeated {loser.display_name} in **{tournament.get('name')}**.",
                ephemeral=False
            )

        except Exception as e:
            print(f"❌ /report_tournament_match error: {e}")
            await interaction.response.send_message(
                "❌ Failed to report tournament match.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(ReportTournamentMatch(bot))
