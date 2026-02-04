import discord
import traceback

GUILD_ID = 1335339358932304055

def setup(bot):
    @bot.event
    async def on_ready():
        print("====================================================")
        print("🔵 ENTERING on_ready() — EVENT FIRED")
        print("====================================================")

        # Bot identity
        try:
            print(f"🤖 Bot user: {bot.user} (type={type(bot.user)})")
        except Exception as e:
            print("❌ ERROR printing bot.user:", repr(e))
            traceback.print_exc()

        # Validate guild object
        print("----------------------------------------------------")
        print("🔍 Validating guild ID...")

        try:
            guild = discord.Object(id=GUILD_ID)
            print(f"🟩 Guild object created successfully: {guild}")
        except Exception as e:
            print("❌ ERROR creating guild object:", repr(e))
            traceback.print_exc()

        # Commands BEFORE sync
        print("----------------------------------------------------")
        print("📋 Commands BEFORE sync:")
        try:
            cmds = bot.tree.get_commands()
            if not cmds:
                print("⚠️ No commands registered BEFORE sync.")
            for cmd in cmds:
                print(f"   • {cmd.name} (type={cmd.type})")
        except Exception as e:
            print("❌ ERROR listing commands BEFORE sync:", repr(e))
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
                print("     - Import errors inside cog files")
                print("     - Wrong guild ID")
                print("     - Bot loaded twice (now fixed)")

            print("📋 Commands returned by sync:")
            for cmd in synced:
                print(f"   • {cmd.name} (type={cmd.type})")

        except Exception as e:
            print("❌ EXCEPTION during sync:", repr(e))
            traceback.print_exc()

        # Commands AFTER sync
        print("----------------------------------------------------")
        print("📋 Commands AFTER sync:")
        try:
            cmds_after = bot.tree.get_commands()
            if not cmds_after:
                print("⚠️ No commands registered AFTER sync.")
            for cmd in cmds_after:
                print(f"   • {cmd.name} (type={cmd.type})")
        except Exception as e:
            print("❌ ERROR listing commands AFTER sync:", repr(e))
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
        print("🟢 on_ready() COMPLETED SUCCESSFULLY — BOT IS LIVE")
        print("====================================================")


