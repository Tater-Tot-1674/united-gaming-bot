import discord
from discord import app_commands
from discord.ext import commands
from services.player_service import player_service

GUILD_ID = 1335339358932304055

class Stats(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="stats",
        description="View your match statistics"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    async def stats(self, interaction: discord.Interaction):
        discord_id = interaction.user.id
        print(f"🔹 /stats called by {interaction.user} ({discord_id})")

        try:
            player = player_service.get_player_by_discord(discord_id)

            if not player:
                print(f"⚠️ Player not found for Discord ID {discord_id}")
                return await interaction.response.send_message(
                    "Player not found.", ephemeral=True
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
            print(f"✅ Sending stats to user {discord_id}")
            await interaction.response.send_message(msg, ephemeral=True)

        except Exception as e:
            print(f"❌ /stats error for Discord ID {discord_id}: {e}")
            await interaction.response.send_message(
                "⚠️ Error fetching stats.", ephemeral=True
            )

async def setup(bot):
    await bot.add_cog(Stats(bot))

