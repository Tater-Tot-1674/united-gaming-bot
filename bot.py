import os
import discord
from discord.ext import commands
import importlib
import pkgutil
from flask import Flask
from threading import Thread
import traceback

# ====================================================
#  WEB SERVER (keeps Render Web Service alive)
# ====================================================
app = Flask(__name__)

@app.route("/")
def home():
    return "OK"

def run_web():
    print("🌐 Flask keep-alive started on port 10000")
    app.run(host="0.0.0.0", port=10000)

Thread(target=run_web).start()

# ====================================================
#  DISCORD BOT SETUP
# ====================================================
TOKEN = os.getenv("DISCORDTOKEN")
if not TOKEN:
    print("❌ Missing DISCORDTOKEN environment variable")
    raise SystemExit

intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)
tree = bot.tree

# ====================================================
#  COMMAND LOADING
# ====================================================
def load_commands():
    print("📦 Loading commands...")
    if not os.path.isdir("commands"):
        print("❌ 'commands' folder missing")
        return

    for module in pkgutil.iter_modules(['commands']):
        try:
            if module.ispkg:
                folder = module.name
                folder_path = f"commands/{folder}"

                for submodule in pkgutil.iter_modules([folder_path]):
                    full_path = f"commands.{folder}.{submodule.name}"
                    imported = importlib.import_module(full_path)
                    print(f"✅ Imported command: {full_path}")
                    if hasattr(imported, "setup"):
                        print(f"🟢 Running setup() for {full_path}")
                        bot.loop.create_task(imported.setup(bot))
            else:
                full_path = f"commands.{module.name}"
                imported = importlib.import_module(full_path)
                print(f"✅ Imported command: {full_path}")
                if hasattr(imported, "setup"):
                    print(f"🟢 Running setup() for {full_path}")
                    bot.loop.create_task(imported.setup(bot))

        except Exception as e:
            print(f"❌ Error importing command '{module.name}': {e}")
            traceback.print_exc()

# ====================================================
#  EVENT LOADING
# ====================================================
def load_events():
    print("📦 Loading events...")
    if not os.path.isdir("events"):
        print("❌ 'events' folder missing")
        return

    for module in pkgutil.iter_modules(['events']):
        try:
            full_path = f"events.{module.name}"
            imported = importlib.import_module(full_path)
            print(f"✅ Imported event: {full_path}")
            if hasattr(imported, "setup"):
                print(f"🟢 Running setup() for event {full_path}")
                imported.setup(bot)
            else:
                print(f"⚠️ Event '{module.name}' missing setup()")
        except Exception as e:
            print(f"❌ Error importing event '{module.name}': {e}")
            traceback.print_exc()

# ====================================================
#  ON READY
# ====================================================
@bot.event
async def on_ready():
    print("============================================================")
    print("🟢 on_ready() fired — BOT ONLINE")
    print(f"🤖 Logged in as {bot.user} (ID: {bot.user.id})")

    # Presence
    try:
        await bot.change_presence(
            activity=discord.Game(name="Your Bot | /help"),
            status=discord.Status.online
        )
        print("🟩 Presence set successfully.")
    except Exception as e:
        print(f"❌ Failed to set presence: {e}")
        traceback.print_exc()

    # Log commands before sync
    print("------------------------------------------------------------")
    print("📋 Commands BEFORE sync:")
    for cmd in bot.tree.get_commands():
        print(f"  • {cmd.name} (type={cmd.type})")
    if not bot.tree.get_commands():
        print("⚠️ No commands registered BEFORE sync.")

    # Sync commands
    print("------------------------------------------------------------")
    print("🔧 Syncing commands...")
    try:
        synced = await bot.tree.sync()
        print(f"🟩 Synced {len(synced)} slash commands globally.")
        for cmd in synced:
            print(f"  • {cmd.name} (type={cmd.type})")
        if len(synced) == 0:
            print("⚠️ WARNING: No commands registered after sync.")
    except Exception as e:
        print(f"❌ Exception during sync: {e}")
        traceback.print_exc()

    print("============================================================")
    print("✅ Bot ready completed successfully.")
    print("============================================================")

# ====================================================
#  STARTUP
# ====================================================
if __name__ == "__main__":
    print("🟦 Starting bot...")
    load_commands()
    load_events()
    bot.run(TOKEN)


