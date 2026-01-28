const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');
const { matchService } = require('../../services/matchService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your match stats or another player\'s stats')
    .addStringOption(option =>
      option.setName('playerid')
        .setDescription('Optional player ID to view stats for')
        .setRequired(false)
    ),
  async execute(interaction) {
    const playerId = interaction.options.getString('playerid');

    try {
      const player = playerId 
        ? await playerService.getPlayerById(playerId) 
        : await playerService.getPlayerByDiscord(interaction.user.id);

      if (!player) return interaction.reply({ content: '⚠️ Player not found or not linked.', ephemeral: true });

      const stats = await matchService.getPlayerStats(player.id);

      await interaction.reply({
        content: `📊 Stats for **${player.username}**\nWins: ${stats.wins}\nLosses: ${stats.losses}\nDraws: ${stats.draws}\nKills: ${stats.kills}\nDeaths: ${stats.deaths}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      await interaction.reply({ content: '❌ Something went wrong while fetching stats.', ephemeral: true });
    }
  }
};

