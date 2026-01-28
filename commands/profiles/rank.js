const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check your current rank or leaderboard position'),

  async execute(interaction) {
    try {
      const player = await playerService.getPlayerByDiscord(interaction.user.id);
      if (!player) return interaction.reply({ content: '⚠️ Player not found.', ephemeral: true });

      await interaction.reply({
        content: `🏅 **${player.username}** is currently ranked **#${player.rank || 'Unranked'}**\n` +
                 `Wins: ${player.wins || 0}, Losses: ${player.losses || 0}, XP: ${player.xp || 0}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error fetching rank:', error);
      await interaction.reply({ content: '❌ Something went wrong while fetching rank.', ephemeral: true });
    }
  }
};

