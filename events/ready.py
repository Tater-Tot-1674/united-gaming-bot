import discord

GUILD_ID = 1335339358932304055  # your server ID

def setup(bot):
    @bot.event
    async def on_ready():
        print(f"🤖 Bot is fully online as {bot.user}")

        # Instant guild‑only slash command sync
        try:
            guild = discord.Object(id=GUILD_ID)
            synced = await bot.tree.sync(guild=guild)
            print(f"⚡ Synced {len(synced)} slash commands to guild {GUILD_ID}")
        except Exception as e:
            print(f"❌ Failed to sync slash commands: {e}")

        # Presence
        try:
            await bot.change_presence(
                activity=discord.Game(name="KartKings | /help"),
                status=discord.Status.online
            )
            print("🎮 Presence updated.")
        except Exception as e:
            print(f"❌ Failed to set presence: {e}")

        print("✅ Bot is ready to roll.")
