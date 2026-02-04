import os
import discord
import importlib
import pkgutil
import traceback
from discord.ext import commands
from flask import Flask
from threading import Thread

# ====================================================
# 🌐 KEEP-ALIVE WEB SERVER (Render)
# ====================================================
app = Flask(__name__)

@app.route("/")
def home():
    return "OK"

def run_web():
    print("🌐 Flask keep-alive started on port 10000", flush=True)
    app.run(host="0.0.0.0", port=10000)

Thread(target=run_web, daemon=True).start()

# ====================================================
# 🤖 DISCORD BOT SETUP
# ====================================================
TOKEN = os.getenv("DISCORDTOKEN")
if not TOKEN:
    print("❌ DISCORDTOKEN missing", flush=True)
    raise SystemExit

intents = discord.Intents.default()
intents.guilds = True
intents.messages = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ====================================================
# 📦 LOAD COMMAND MODULES
# ====================================================
async def load_commands():
    print("📦 Loading commands...", flush=True)

    if not os.path.isdir("commands"):
        print("❌ 'commands' folder missing", flush=True)
        return

    for module in pkgutil.iter_modules(['commands']):
        try:
            if module.ispkg:
                folder_path = f"commands/{module.name}"
                for submodule in pkgutil.iter_modules([folder_path]):
                    full_path = f"commands.{module.name}.{submodule.name}"
                    await load_command_module(full_path)
            else:
                await load_command_module(f"commands.{module.name}")

        except Exception as e:
            print(f"❌ Failed loading command package {module.name}: {e}", flush=True)
            traceback.print_exc()


async def load_command_module(full_path):
    try:
        imported = importlib.import_module(full_path)
        print(f"✅ Imported command: {full_path}", flush=True)

        if hasattr(imported, "setup"):
            await imported.setup(bot)
            print(f"🟢 setup() complete for {full_path}", flush=True)
        else:
            print(f"⚠️ No setup() in {full_path}", flush=True)

    except Exception as e:
        print(f"❌ Error importing {full_path}: {e}", flush=True)
        traceback.print_exc()


# ====================================================
# 🎭 LOAD EVENTS
# ====================================================
def load_events():
    print("📦 Loading events...", flush=True)

    if not os.path.isdir("events"):
        print("❌ 'events' folder missing", flush=True)
        return

    for module in pkgutil.iter_modules(['events']):
        try:
            full_path = f"events.{module.name}"
            imported = importlib.import_module(full_path)
            print(f"✅ Imported event: {full_path}", flush=True)

            if hasattr(imported, "setup"):
                imported.setup(bot)
                print(f"🟢 Event setup executed: {module.name}", flush=True)
            else:
                print(f"⚠️ Event {module.name} missing setup()", flush=True)

        except Exception as e:
            print(f"❌ Error loading event {module.name}: {e}", flush=True)
            traceback.print_exc()


# ====================================================
# 🚀 BOT READY EVENT
# ====================================================
@bot.event
async def on_ready():
    print("="*60, flush=True)
    print("🟢 BOT ONLINE", flush=True)
    print(f"🤖 Logged in as {bot.user} (ID: {bot.user.id})", flush=True)

    # Presence
    try:
        await bot.change_presence(
            activity=discord.Game(name="KartKings | /help"),
            status=discord.Status.online
        )
        print("🟩 Presence set", flush=True)
    except Exception as e:
        print("❌ Presence error:", e, flush=True)
        traceback.print_exc()

    # List commands BEFORE sync
    cmds = bot.tree.get_commands()
    print(f"📋 Commands before sync: {len(cmds)}", flush=True)
    for c in cmds:
        print(f"   • {c.name}", flush=True)

    # Sync
    try:
        synced = await bot.tree.sync()
        print(f"🟩 Synced {len(synced)} global slash commands", flush=True)
        for c in synced:
            print(f"   • {c.name}", flush=True)

        if not synced:
            print("⚠️ ZERO COMMANDS SYNCED", flush=True)

    except Exception as e:
        print("❌ Sync failed:", e, flush=True)
        traceback.print_exc()

    print("="*60, flush=True)


# ====================================================
# 🟦 STARTUP SEQUENCE
# ====================================================
async def main():
    async with bot:
        await load_commands()  # MUST happen before start
        load_events()
        await bot.start(TOKEN)


if __name__ == "__main__":
    print("🟦 Starting bot...", flush=True)
    import asyncio
    asyncio.run(main())



