import json
import discord
from discord import app_commands
from discord.ext import commands
from utils.constants import DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN
from utils.syncToSite import sync_to_site

PLAYERS_PATH = DATA_PATHS["PLAYERS"]
GUILD_ID = 1335339358932304055

class Link(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(
        name="link",
        description="Link your Discord account to a player"
    )
    @app_commands.guilds(discord.Object(id=GUILD_ID))
    @app_commands.describe(player_tag="Your in‑game player tag")
    async def link(self, interaction: discord.Interaction, player_tag: str):
        discord_id = interaction.user.id
        print(f"🔹 /link called by {interaction.user} ({discord_id}) with tag: {player_tag}")

        # Load players
        try:
            with open(PLAYERS_PATH, "r", encoding="utf8") as f:
                players = json.load(f)
            print(f"✅ Loaded players.json successfully")
        except Exception as e:
            print(f"❌ Failed to read players.json: {e}")
            return await interaction.response.send_message(
                "⚠️ There was an error reading player data.",
                ephemeral=False
            )

        # Check if already linked
        if any(p.get("discordId") == discord_id for p in players):
            print(f"⚠️ User {discord_id} already linked")
            return await interaction.response.send_message(
                "Your account is already linked!",
                ephemeral=False
            )

        # Find player by tag
        player = next((p for p in players if p.get("username") == player_tag), None)
        if not player:
            print(f"⚠️ Player tag '{player_tag}' not found")
            return await interaction.response.send_message(
                "Player not found.",
                ephemeral=False
            )

        # Link account
        player["discordId"] = discord_id

        try:
            with open(PLAYERS_PATH, "w", encoding="utf8") as f:
                json.dump(players, f, indent=2)
            print(f"✅ Linked {discord_id} to player {player_tag}")
        except Exception as e:
            print(f"❌ Failed to write players.json: {e}")
            return await interaction.response.send_message(
                "⚠️ There was an error saving your link.",
                ephemeral=False
            )

        # Sync to GitHub
        try:
            sync_to_site("players.json", WEBSITE_REPO, GITHUB_TOKEN)
            print(f"✅ players.json synced to GitHub successfully")
        except Exception as e:
            print(f"❌ syncToSite failed: {e}")

        return await interaction.response.send_message(
            f"✅ Successfully linked to **{player['username']}**!",
            ephemeral=False
        )

async def setup(bot):
    await bot.add_cog(Link(bot))



