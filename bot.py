import os
import discord
from discord.ext import commands
import importlib
import pkgutil
from flask import Flask
from threading import Thread

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

# ====================================================
#  DISCORD BOT SETUP
# ====================================================
TOKEN = os.getenv("DISCORDTOKEN")
if not TOKEN:
    print("❌ Missing DISCORDTOKEN", flush=True)
    raise SystemExit

intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)
tree = bot.tree

# ====================================================
#  LOAD COMMANDS
# ====================================================
def load_commands():
    if not os.path.isdir("commands"):
        print("❌ 'commands' folder missing", flush=True)
        return

    for module in pkgutil.iter_modules(['commands']):
        try:
            if module.ispkg:
                folder = module.name
                folder_path = f"commands/{folder}"
                for submodule in pkgutil.iter_modules([folder_path]):
                    full_path = f"commands.{folder}.{submodule.name}"
                    importlib.import_module(full_path)
                    print(f"✔ Loaded command: {full_path}", flush=True)
            else:
                full_path = f"commands.{module.name}"
                importlib.import_module(full_path)
                print(f"✔ Loaded command: {full_path}", flush=True)
        except Exception as e:
            print(f"❌ Error loading command '{module.name}': {e}", flush=True)

# ====================================================
#  LOAD EVENTS
# ====================================================
def load_events():
    if not os.path.isdir("events"):
        print("❌ 'events' folder missing", flush=True)
        return

    for module in pkgutil.iter_modules(['events']):
        try:
            full_path = f"events.{module.name}"
            imported = importlib.import_module(full_path)
            if hasattr(imported, "setup"):
                imported.setup(bot)
                print(f"✔ Loaded event: {module.name}", flush=True)
            else:
                print(f"⚠️ Event '{module.name}' missing setup()", flush=True)
        except Exception as e:
            print(f"❌ Error loading event '{module.name}': {e}", flush=True)

# ====================================================
#  STARTUP
# ====================================================
if __name__ == "__main__":
    print("🟦 Starting bot...", flush=True)
    load_commands()
    load_events()
    bot.run(TOKEN)



