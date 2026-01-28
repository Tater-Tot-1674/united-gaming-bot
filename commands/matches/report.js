const { SlashCommandBuilder } = require('discord.js');
const { matchService } = require('../../services/matchService');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report the result of a match')
    .addStringOption(option =>
      option.setName('opponent')
        .setDescription('Opponent player ID')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('your_score')
        .setDescription('Your score')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('opponent_score')
        .setDescription('Opponent score')
        .setRequired(true)
    ),
  async execute(interaction) {
    const opponentId = interaction.options.getString('opponent');
    const yourScore = interaction.options.getInteger('your_score');
    const opponentScore = interaction.options.getInteger('opponent_score');

    try {
      const player = await playerService.getPlayerByDiscord(interaction.user.id);
      const opponent = await playerService.getPlayerById(opponentId);

      if (!player) return interaction.reply({ content: '⚠️ You must link your account first using `/link`.', ephemeral: true });
      if (!opponent) return interaction.reply({ content: '⚠️ Opponent not found.', ephemeral: true });

      await matchService.recordMatch(player.id, opponent.id, yourScore, opponentScore);

      await interaction.reply({ content: `🏁 Match recorded: **${player.username} ${yourScore} - ${opponentScore} ${opponent.username}**`, ephemeral: true });
    } catch (error) {
      console.error('Error reporting match:', error);
      await interaction.reply({ content: '❌ Something went wrong while reporting the match.', ephemeral: true });
    }
  }
};


