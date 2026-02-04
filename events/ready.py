import discord
import traceback

# Set your guild ID here for testing slash commands
GUILD_ID = 1335339358932304055  # Replace with your server ID

def setup(bot):
    @bot.event
    async def on_ready():
        print("====================================================", flush=True)
        print("🟢 on_ready() — BOT IS ONLINE", flush=True)
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

        # Sync slash commands to guild
        try:
            guild = discord.Object(id=GUILD_ID)
            synced = await bot.tree.sync(guild=guild)
            print(f"🟩 Synced {len(synced)} slash commands to guild {GUILD_ID}", flush=True)
            if len(synced) == 0:
                print("⚠️ No commands registered. Check commands folder or decorators.", flush=True)
        except Exception as e:
            print("❌ Error syncing commands:", repr(e), flush=True)
            traceback.print_exc()

        # List loaded commands
        print("📋 Registered slash commands:", flush=True)
        for cmd in bot.tree.get_commands():
            print(f"   • {cmd.name} (type={cmd.type})", flush=True)

        print("====================================================", flush=True)


