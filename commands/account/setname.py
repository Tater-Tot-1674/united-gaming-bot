import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

PLAYERS_PATH = DATA_PATHS["PLAYERS"]
GUILD_ID = 1335339358932304055

class SetName(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="setname",
        description="Set or update your in-game player name"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(new_name="Your new in-game name")
    async def setname(self, interaction: discord.Interaction, new_name: str):
        discord_id = interaction.user.id
        print(f"🔹 /setname called by {interaction.user} ({discord_id}) with new name: {new_name}")

        # Load players
        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
            print("✅ Loaded players.json successfully")
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "⚠️ There was an error reading player data.",
                ephemeral=True
            )

        # Find player by Discord ID
        player = next((p for p in players if p.get("discordId") == discord_id), None)
        if not player:
            print(f"⚠️ User {discord_id} not linked to any player")
            return await interaction.response.send_message(
                "You must link your account first using `/link`.",
                ephemeral=True
            )

        # Update name
        old_name = player.get("username")
        player["username"] = new_name
        print(f"✏️ Changing player name from '{old_name}' to '{new_name}' for user {discord_id}")

        # Save changes
        try:
            with open(PLAYERS_PATH, "w", encoding="utf8") as f:
                json.dump(players, f, indent=2)
            print(f"✅ Updated players.json successfully for {discord_id}")
        except Exception as e:
            print(f"❌ Failed to write players.json: {e}")
            return await interaction.response.send_message(
                "⚠️ There was an error saving your new name.",
                ephemeral=True
            )

        # Sync to GitHub
        try:
            sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
            print("✅ players.json synced to GitHub successfully")
        except Exception as e:
            print(f"❌ syncToSite failed: {e}")

        return await interaction.response.send_message(
            f"✅ Your in-game name has been updated from **{old_name}** to **{new_name}**!",
            ephemeral=True
        )

async def setup(bot):
    await bot.add_cog(SetName(bot))

