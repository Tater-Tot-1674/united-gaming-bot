import discord

def setup(bot):
    @bot.event
    async def on_ready():
        print(f"🤖 Bot is fully online as {bot.user}")

        # Set presence
        await bot.change_presence(
            activity=discord.Game(name="KartKings | /help"),
            status=discord.Status.online
        )

        print("✅ Presence set. Bot is ready to roll.")
