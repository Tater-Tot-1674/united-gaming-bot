import os
import discord
from discord.ext import commands
import importlib
import pkgutil

print(">>> BOT.PY EXECUTED <<<")

print("====================================================")
print("🚀 Starting bot.py (BEGIN)")
print("====================================================")

# -------------------------------------
# Load environment variables
# -------------------------------------
print("🔍 Checking environment variables...")

TOKEN = os.getenv("DISCORDTOKEN")
if not TOKEN:
    print("❌ ERROR: Missing DISCORDTOKEN in environment variables.")
    raise SystemExit

print("🟩 DISCORDTOKEN found.")

# -------------------------------------
# Discord Client Setup
# -------------------------------------
print("⚙️ Setting up Discord client...")

intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(
    command_prefix="!",
    intents=intents
)

tree = bot.tree

print("🟩 Discord client initialized.")

# -------------------------------------
# Auto‑Load Commands (Cogs)
# -------------------------------------
print("📦 Loading commands...")

def load_commands():
    if not os.path.isdir("commands"):
        print("❌ ERROR: 'commands' folder not found!")
        return

    for module in pkgutil.iter_modules(['commands']):
        try:
            if module.ispkg:
                folder = module.name
                folder_path = f"commands/{folder}"

                for submodule in pkgutil.iter_modules([folder_path]):
                    full_path = f"commands.{folder}.{submodule.name}"
                    importlib.import_module(full_path)
                    print(f"✔ Loaded command module: {full_path}")

            else:
                full_path = f"commands.{module.name}"
                importlib.import_module(full_path)
                print(f"✔ Loaded command module: {full_path}")

        except Exception as e:
            print(f"❌ ERROR loading command module '{module.name}': {e}")

# -------------------------------------
# Auto‑Load Events
# -------------------------------------
print("🎧 Loading events...")

def load_events():
    if not os.path.isdir("events"):
        print("❌ ERROR: 'events' folder not found!")
        return

    for module in pkgutil.iter_modules(['events']):
        try:
            full_path = f"events.{module.name}"
            imported = importlib.import_module(full_path)

            if hasattr(imported, "setup"):
                imported.setup(bot)
                print(f"✔ Event loaded: {module.name}")
            else:
                print(f"⚠️ Event module '{module.name}' has no setup() function.")

        except Exception as e:
            print(f"❌ ERROR loading event module '{module.name}': {e}")

# -------------------------------------
# Main Startup
# -------------------------------------
if __name__ == "__main__":
    print("====================================================")
    print("🔧 Initializing bot system...")
    print("====================================================")

    load_commands()
    load_events()

    print("🔑 Logging into Discord...")
    print("====================================================")
    bot.run(TOKEN)

