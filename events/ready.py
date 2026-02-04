import discord

GUILD_ID = 1335339358932304055  # your server ID here

def setup(bot):
    @bot.event
    async def on_ready():
        print(f"🤖 Bot is fully online as {bot.user}")

        # Sync slash commands instantly for your server
        guild = discord.Object(id=GUILD_ID)
        synced = await bot.tree.sync(guild=guild)
        print(f"⚡ Synced {len(synced)} commands to guild {GUILD_ID}")

        # Set presence
        await bot.change_presence(
            activity=discord.Game(name="KartKings | /help"),
            status=discord.Status.online
        )

        print("✅ Presence set. Bot is ready to roll.")
