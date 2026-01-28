const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your KartKings account is linked to Discord'),
  async execute(interaction) {
    try {
      const player = await playerService.getByDiscordId(interaction.user.id);

      if (player) {
        await interaction.reply({ content: `✅ Your account is verified! Player ID: ${player.id}`, ephemeral: true });
      } else {
        await interaction.reply({ content: `⚠️ No linked account found. Use /link first.`, ephemeral: true });
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      await interaction.reply({ content: '❌ Something went wrong while verifying your account.', ephemeral: true });
    }
  }
};

