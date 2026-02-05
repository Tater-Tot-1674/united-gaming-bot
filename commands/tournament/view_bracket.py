import discord
from discord import app_commands
from discord.ext import commands
from services.tournament_service import tournament_service

GUILD_ID = 1335339358932304055

class ViewBracket(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="view_bracket",
        description="View the bracket for a tournament"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(
        tournament_id="The ID of the tournament you want to view"
    )
    async def view_bracket(self, interaction: discord.Interaction, tournament_id: str):
        try:
            tournament = tournament_service.get_tournament(tournament_id)
            if not tournament:
                await interaction.response.send_message(
                    "⚠️ Tournament not found.", ephemeral=True
                )
                return

            bracket = tournament.get("bracket", [])
            if not bracket:
                await interaction.response.send_message(
                    "ℹ️ Bracket has not been generated yet.", ephemeral=True
                )
                return

            # Build a simple Discord embed for the bracket
            embed = discord.Embed(
                title=f"🏁 {tournament.get('name')} Bracket",
                color=discord.Color.blue()
            )

            for match in bracket:
                p1 = match.get("player1_name", match.get("player1", "Unknown"))
                p2 = match.get("player2_name", match.get("player2", "Unknown"))
                embed.add_field(name=f"{p1} vs {p2}", value="\u200b", inline=False)

            await interaction.response.send_message(embed=embed, ephemeral=False)

        except Exception as e:
            print(f"❌ /view_bracket error: {e}")
            await interaction.response.send_message(
                "❌ Something went wrong while fetching the bracket.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(ViewBracket(bot))
