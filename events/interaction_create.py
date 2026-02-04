import discord
import traceback

def setup(bot):
    @bot.event
    async def on_interaction(interaction: discord.Interaction):
        # Only handle slash commands
        if interaction.type != discord.InteractionType.application_command:
            return

        try:
            # Let discord.py handle the command normally
            await bot.process_application_commands(interaction)
        except Exception as e:
            print(f"❌ Slash command error: {e}")
            traceback.print_exc()

            # Respond safely
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
