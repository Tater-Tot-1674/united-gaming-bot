const { SlashCommandBuilder } = require('discord.js');
const { matchService } = require('../../services/matchService');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a match result')
    .addUserOption(option =>
      option.setName('opponent')
        .setDescription('The player you played against')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('result')
        .setDescription('Match result')
        .setRequired(true)
        .addChoices(
          { name: 'Win', value: 'win' },
          { name: 'Loss', value: 'loss' }
        )),
        
  async execute(interaction) {
    try {
      const reporter = interaction.user;
      const opponentUser = interaction.options.getUser('opponent');
      const result = interaction.options.getString('result');

      if (reporter.id === opponentUser.id) {
        return interaction.reply({ content: 'You cannot report a match against yourself.', ephemeral: true });
      }

      const player = await playerService.getPlayerByDiscord(reporter.id);
      const opponent = await playerService.getPlayerByDiscord(opponentUser.id);

      if (!player || !opponent) {
        return interaction.reply({ content: 'Both players must be registered.', ephemeral: true });
      }

      await matchService.recordMatch(player, opponent, result);

      await interaction.reply({
        content: `✅ Match recorded!\n${player.username} **${result.toUpperCase()}** vs ${opponent.username}`,
        ephemeral: true
      });

    } catch (err) {
      console.error(err);
      await interaction.reply({ content: 'Error recording match.', ephemeral: true });
    }
  }
};


