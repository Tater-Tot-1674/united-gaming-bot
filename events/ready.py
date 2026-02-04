import discord
import traceback
from discord.ext import commands

GUILD_ID = 1335339358932304055

def setup(bot: commands.Bot):

    @bot.event
    async def on_ready():

        print("=" * 60, flush=True)
        print("🟢 on_ready() fired — BOT ONLINE", flush=True)
        print(f"🤖 Logged in as {bot.user} (ID: {bot.user.id})", flush=True)

        # Presence
        try:
            await bot.change_presence(
                activity=discord.Game(name="KartKings | /help"),
                status=discord.Status.online
            )
            print("🟩 Presence set successfully.", flush=True)
        except Exception as e:
            print("❌ Error setting presence:", repr(e), flush=True)
            traceback.print_exc()

        # Guild slash sync (instant updates)
        try:
            guild = discord.Object(id=GUILD_ID)
            synced = await bot.tree.sync(guild=guild)
            print(f"🟩 Synced {len(synced)} slash commands to guild {GUILD_ID}", flush=True)
        except Exception as e:
            print("❌ Error syncing commands:", repr(e), flush=True)
            traceback.print_exc()

        # Show commands
        print("📋 Registered slash commands:", flush=True)
        for cmd in bot.tree.get_commands():
            print(f"   • {cmd.name} (type={cmd.type})", flush=True)

        print("=" * 60, flush=True)
        print("✅ Bot ready completed successfully.", flush=True)
        print("=" * 60, flush=True)

