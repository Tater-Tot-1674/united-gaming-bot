const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rival')
    .setDescription('Compare your stats against a rival player')
    .addUserOption(option =>
      option.setName('player')
        .setDescription('Mention a rival to compare stats')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      const user = interaction.user;
      const rivalUser = interaction.options.getUser('player');

      const player = await playerService.getPlayerByDiscord(user.id);
      const rival = await playerService.getPlayerByDiscord(rivalUser.id);

      if (!player || !rival) return interaction.reply({ content: '⚠️ Player not found.', ephemeral: true });

      await interaction.reply({
        content: `⚔️ **${player.username} vs ${rival.username}**\n` +
                 `Wins: ${player.wins || 0} vs ${rival.wins || 0}\n` +
                 `Losses: ${player.losses || 0} vs ${rival.losses || 0}\n` +
                 `Rank: ${player.rank || 'Unranked'} vs ${rival.rank || 'Unranked'}\n` +
                 `XP: ${player.xp || 0} vs ${rival.xp || 0}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error comparing rivals:', error);
      await interaction.reply({ content: '❌ Something went wrong while comparing stats.', ephemeral: true });
    }
  }
};


