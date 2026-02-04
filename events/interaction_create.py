import discord
import traceback
from discord.ext import commands

def setup(bot: commands.Bot):

    @bot.event
    async def on_interaction(interaction: discord.Interaction):

        # Only care about slash commands
        if interaction.type != discord.InteractionType.application_command:
            return

        try:
            await bot.process_application_commands(interaction)

        except Exception as e:
            print(f"❌ Slash command error: {e}")
            traceback.print_exc()

            try:
                if interaction.response.is_done():
                    await interaction.followup.send(
                        "❌ There was an error executing this command.",
                        ephemeral=True
                    )
                else:
                    await interaction.response.send_message(
                        "❌ There was an error executing this command.",
                        ephemeral=True
                    )
            except Exception as inner:
                print(f"❌ Failed to send error message: {inner}")
