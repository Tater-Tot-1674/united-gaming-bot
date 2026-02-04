import os
import discord
from discord.ext import commands
import importlib
import pkgutil
from flask import Flask
import threading

# -------------------------------------
# Load environment variables
# -------------------------------------
print("🔍 Checking environment variables...")

TOKEN = os.getenv("DISCORDTOKEN")
if not TOKEN:
    print("❌ Missing DISCORDTOKEN in environment variables.")
    raise SystemExit

# -------------------------------------
# Discord Client Setup
# -------------------------------------
intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(
    command_prefix="!",
    intents=intents
)

tree = bot.tree

# -------------------------------------
# Auto‑Load Commands (Cogs)
# -------------------------------------
print("📦 Loading commands...")

def load_commands():
    for module in pkgutil.iter_modules(['commands']):
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

# -------------------------------------
# Auto‑Load Events
# -------------------------------------
print("🎧 Loading events...")

def load_events():
    for module in pkgutil.iter_modules(['events']):
        full_path = f"events.{module.name}"
        imported = importlib.import_module(full_path)

        if hasattr(imported, "setup"):
            imported.setup(bot)
            print(f"✔ Event loaded: {module.name}")

# -------------------------------------
# Flask Keepalive Server (Render)
# -------------------------------------
app = Flask(__name__)

@app.route("/")
def home():
    return "Bot is running."

def run_flask():
    port = int(os.getenv("PORT", 10000))
    app.run(host="0.0.0.0", port=port)

def start_keepalive():
    thread = threading.Thread(target=run_flask)
    thread.start()

# -------------------------------------
# Main Startup
# -------------------------------------
if __name__ == "__main__":
    load_commands()
    load_events()
    start_keepalive()
    print("🔑 Logging into Discord...")
    bot.run(TOKEN)

