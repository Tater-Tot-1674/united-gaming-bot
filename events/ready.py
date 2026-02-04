import discord
import traceback
from bot import start_keepalive   # import the keepalive starter

GUILD_ID = 1335339358932304055

def setup(bot):
    @bot.event
    async def on_ready():
        print("====================================================")
        print("🔵 ENTERING on_ready()")
        print("====================================================")

        try:
            print(f"🤖 Bot user object: {bot.user} (type={type(bot.user)})")
        except Exception as e:
            print("❌ ERROR printing bot.user:", repr(e))

        # Start keepalive AFTER bot is ready
        try:
            print("🟦 Starting keepalive thread...")
            start_keepalive()
            print("🟩 Keepalive thread started successfully.")
        except Exception as e:
            print("❌ ERROR starting keepalive:", repr(e))
            traceback.print_exc()

        # Validate guild object
        print("----------------------------------------------------")
        print("🔍 Validating guild ID...")

        try:
            guild = discord.Object(id=GUILD_ID)
            print(f"🟩 Guild object created: {guild} (ID={GUILD_ID})")
        except Exception as e:
            print("❌ ERROR creating guild object:", repr(e))
            traceback.print_exc()

        # Debug: list commands BEFORE sync
        print("----------------------------------------------------")
        print("📋 Commands BEFORE sync:")
        try:
            for cmd in bot.tree.get_commands():
                print(f"   • {cmd.name} (type={cmd.type})")
        except Exception as e:
            print("❌ ERROR listing commands before sync:", repr(e))
            traceback.print_exc()

        # Sync commands
        print("----------------------------------------------------")
        print("🔧 Starting guild sync...")

        try:
            synced = await bot.tree.sync(guild=guild)

            print("🟩 Guild sync completed.")
            print(f"🟦 Discord returned {len(synced)} commands.")

            if len(synced) == 0:
                print("⚠️ WARNING: Sync returned ZERO commands.")
                print("   → This means commands did NOT register.")
                print("   → Possible causes:")
                print("     - Missing __init__.py in commands/")
                print("     - Cogs missing setup()")
                print("     - Decorators missing guild=discord.Object(...)")
                print("     - Bot loaded twice / race condition")
                print("     - Wrong guild ID")
                print("     - Import errors inside cog files")

            print("📋 Commands returned by sync:")
            for cmd in synced:
                print(f"   • {cmd.name} (type={cmd.type})")

        except Exception as e:
            print("❌ EXCEPTION during sync:", repr(e))
            traceback.print_exc()

        # Debug: list commands AFTER sync
        print("----------------------------------------------------")
        print("📋 Commands AFTER sync:")
        try:
            for cmd in bot.tree.get_commands():
                print(f"   • {cmd.name} (type={cmd.type})")
        except Exception as e:
            print("❌ ERROR listing commands after sync:", repr(e))
            traceback.print_exc()

        # Presence
        print("----------------------------------------------------")
        print("🎮 Setting presence...")

        try:
            await bot.change_presence(
                activity=discord.Game(name="KartKings | /help"),
                status=discord.Status.online
            )
            print("🟩 Presence updated successfully.")
        except Exception as e:
            print("❌ ERROR setting presence:", repr(e))
            traceback.print_exc()

        print("====================================================")
        print("🟢 on_ready() COMPLETED SUCCESSFULLY")
        print("====================================================")

