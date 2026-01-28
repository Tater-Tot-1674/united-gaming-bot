const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your match statistics'),

  async execute(interaction) {
    try {
      const player = await playerService.getPlayerByDiscord(interaction.user.id);

      if (!player) {
        return interaction.reply({ content: 'Player not found.', ephemeral: true });
      }

      const games = (player.wins || 0) + (player.losses || 0);
      const winRate = games > 0 ? ((player.wins / games) * 100).toFixed(1) : 0;

      await interaction.reply({
        content:
          `📊 **Your Stats**\n` +
          `Games: ${games}\n` +
          `Wins: ${player.wins || 0}\n` +
          `Losses: ${player.losses || 0}\n` +
          `Win Rate: ${winRate}%`,
        ephemeral: true
      });

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Error fetching stats.', ephemeral: true });
    }
  }
};


