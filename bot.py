import os
import discord
from discord.ext import commands
import importlib
import pkgutil
import threading
import http.server
import socketserver
import threading
import os

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

def start_dummy_server():
    port = int(os.getenv("PORT", 10000))

    handler = http.server.SimpleHTTPRequestHandler

    def run():
        with socketserver.TCPServer(("", port), handler) as httpd:
            print(f"🌐 Dummy server running on port {port}")
            httpd.serve_forever()

    thread = threading.Thread(target=run, daemon=True)
    thread.start()


# -------------------------------------
# Main Startup
# -------------------------------------
if __name__ == "__main__":
    load_commands()
    load_events()
    print("🔑 Logging into Discord...")
    bot.run(TOKEN)
