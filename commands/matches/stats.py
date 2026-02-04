from discord import app_commands
from discord.ext import commands
from services.player_service import player_service

GUILD_ID = 1335339358932304055

class Stats(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="stats", description="View your match statistics")
    async def stats(self, interaction):
        try:
            player = player_service.get_player_by_discord(interaction.user.id)

            if not player:
                return await interaction.response.send_message(
                    "Player not found.",
                    ephemeral=True
                )

            wins = player.get("wins", 0)
            losses = player.get("losses", 0)
            games = wins + losses
            win_rate = round((wins / games) * 100, 1) if games > 0 else 0

            msg = (
                f"📊 **Your Stats**\n"
                f"Games: {games}\n"
                f"Wins: {wins}\n"
                f"Losses: {losses}\n"
                f"Win Rate: {win_rate}%"
            )

            return await interaction.response.send_message(msg, ephemeral=True)

        except Exception as e:
            print(f"❌ Stats command error: {e}")
            return await interaction.response.send_message(
                "Error fetching stats.",
                ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(Stats(bot))


