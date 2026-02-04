import os
import discord
from discord.ext import commands
import importlib
import pkgutil
from flask import Flask
from threading import Thread
import asyncio
import traceback

# ====================================================
#  WEB SERVER (keeps Render Web Service alive)
# ====================================================
app = Flask(__name__)

@app.route("/")
def home():
    return "OK"

def run_web():
    app.run(host="0.0.0.0", port=10000)

Thread(target=run_web, daemon=True).start()
print("🌐 Flask keep-alive started on port 10000")

# ====================================================
#  DISCORD BOT SETUP
# ====================================================
TOKEN = os.getenv("DISCORDTOKEN")
if not TOKEN:
    print("❌ Missing DISCORDTOKEN")
    raise SystemExit

intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)
tree = bot.tree

GUILD_ID = 1335339358932304055  # Change as needed

# ====================================================
#  COMMAND LOADER (async Cogs)
# ====================================================
async def load_commands():
    print("📦 Loading commands...")
    if not os.path.isdir("commands"):
        print("❌ 'commands' folder missing")
        return

    for module in pkgutil.iter_modules(["commands"]):
        try:
            full_path = f"commands.{module.name}"
            imported = importlib.import_module(full_path)
            print(f"✅ Imported package: {full_path}")

            if hasattr(imported, "setup"):
                if asyncio.iscoroutinefunction(imported.setup):
                    await imported.setup(bot)
                else:
                    imported.setup(bot)
                print(f"🟢 Cog setup executed: {module.name}")
            else:
                print(f"⚠️ No setup() in {module.name}, skipping Cog registration.")

        except Exception as e:
            print(f"❌ Error loading command '{module.name}': {e}")
            traceback.print_exc()

# ====================================================
#  EVENT LOADER
# ====================================================
async def load_events():
    print("📦 Loading events...")
    if not os.path.isdir("events"):
        print("❌ 'events' folder missing")
        return

    for module in pkgutil.iter_modules(["events"]):
        try:
            full_path = f"events.{module.name}"
            imported = importlib.import_module(full_path)
            print(f"✅ Imported event: {full_path}")

            if hasattr(imported, "setup"):
                if asyncio.iscoroutinefunction(imported.setup):
                    await imported.setup(bot)
                else:
                    imported.setup(bot)
                print(f"🟢 Event setup executed: {module.name}")
            else:
                print(f"⚠️ Event '{module.name}' missing setup()")

        except Exception as e:
            print(f"❌ Error loading event '{module.name}': {e}")
            traceback.print_exc()

# ====================================================
#  ON READY
# ====================================================
@bot.event
async def on_ready():
    print("="*60)
    print("🟢 on_ready() fired — BOT ONLINE")
    print(f"🤖 Logged in as {bot.user} (ID: {bot.user.id})")

    # Presence
    try:
        await bot.change_presence(
            activity=discord.Game(name="KartKings | /help"),
            status=discord.Status.online
        )
        print("🟩 Presence set successfully.")
    except Exception as e:
        print(f"❌ Error setting presence: {e}")
        traceback.print_exc()

    # Sync guild commands
    try:
        guild = discord.Object(id=GUILD_ID)
        synced = await tree.sync(guild=guild)
        print(f"🟩 Synced {len(synced)} slash commands to guild {GUILD_ID}")
        if not synced:
            print("⚠️ WARNING: No slash commands were synced!")
        for cmd in synced:
            print(f"   • {cmd.name} (type={cmd.type})")
    except Exception as e:
        print(f"❌ Error during guild command sync: {e}")
        traceback.print_exc()

    print("="*60)
    print("✅ Bot ready completed successfully.")
    print("="*60)

# ====================================================
#  STARTUP
# ====================================================
async def main():
    try:
        await load_commands()
        await load_events()
        print("🟩 All commands/events attempted to load.")
        await bot.start(TOKEN)
    except Exception as e:
        print(f"❌ Fatal error starting bot: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    print("🟦 Starting bot...")
    asyncio.run(main())


