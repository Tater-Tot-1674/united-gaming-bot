const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your linked KartKings account to access commands'),
  async execute(interaction) {
    try {
      const player = await playerService.getPlayerByDiscord(interaction.user.id);

      if (player) {
        await interaction.reply({ content: `✅ Your account **${player.username}** is verified!`, ephemeral: true });
      } else {
        await interaction.reply({ content: '⚠️ You do not have a linked KartKings account. Use `/link` first.', ephemeral: true });
      }
    } catch (error) {
      console.error('Error verifying player:', error);
      await interaction.reply({ content: '❌ Something went wrong during verification.', ephemeral: true });
    }
  }
};
