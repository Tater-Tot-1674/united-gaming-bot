import os
import discord
from discord.ext import commands
import importlib
import pkgutil
from flask import Flask
from threading import Thread
import traceback

# ====================================================
#  WEB SERVER (keeps Render alive)
# ====================================================
app = Flask(__name__)

@app.route("/")
def home():
    return "OK"

def run_web():
    app.run(host="0.0.0.0", port=10000)

Thread(target=run_web, daemon=True).start()
print("🌐 Flask keep-alive started on port 10000", flush=True)

# ====================================================
#  BOT SETUP
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
#  HELPER: LOG ANY IMPORT ERROR
# ====================================================
def safe_import(path):
    try:
        mod = importlib.import_module(path)
        print(f"✔ Imported {path}", flush=True)
        return mod
    except Exception as e:
        print(f"❌ Failed to import {path} -> {repr(e)}", flush=True)
        traceback.print_exc()
        return None

# ====================================================
#  LOAD COMMANDS (recursive)
# ====================================================
def load_commands(path="commands", parent="commands"):
    if not os.path.isdir(path):
        print(f"❌ Commands folder '{path}' missing", flush=True)
        return

    for module in pkgutil.iter_modules([path]):
        full_path = f"{parent}.{module.name}"
        if module.ispkg:
            print(f"📂 Found subpackage: {full_path}", flush=True)
            load_commands(f"{path}/{module.name}", full_path)
        else:
            print(f"📄 Found command file: {full_path}", flush=True)
            safe_import(full_path)

# ====================================================
#  LOAD EVENTS
# ====================================================
def load_events(path="events", parent="events"):
    if not os.path.isdir(path):
        print(f"❌ Events folder '{path}' missing", flush=True)
        return

    for module in pkgutil.iter_modules([path]):
        full_path = f"{parent}.{module.name}"
        imported = safe_import(full_path)
        if imported:
            if hasattr(imported, "setup"):
                try:
                    imported.setup(bot)
                    print(f"🟢 Event setup executed: {full_path}", flush=True)
                except Exception as e:
                    print(f"❌ Error running setup() for {full_path}: {repr(e)}", flush=True)
                    traceback.print_exc()
            else:
                print(f"⚠️ Event {full_path} missing setup()", flush=True)

# ====================================================
#  START BOT
# ====================================================
if __name__ == "__main__":
    print("🟦 Starting bot...", flush=True)
    load_commands()
    load_events()
    print("🟩 All commands/events attempted to load.", flush=True)
    bot.run(TOKEN)




