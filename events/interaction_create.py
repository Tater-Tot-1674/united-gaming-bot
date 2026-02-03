import discord

def setup(bot):
    @bot.event
    async def on_interaction(interaction: discord.Interaction):
        # Only handle slash commands
        if not interaction.type == discord.InteractionType.application_command:
            return

        command = bot.tree.get_command(interaction.command.name)
        if not command:
            return

        try:
            await bot.tree.dispatch(interaction)
        except Exception as e:
            print(f"❌ Command execution error: {e}")

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

