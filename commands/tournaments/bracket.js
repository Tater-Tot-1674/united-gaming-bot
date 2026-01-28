const { SlashCommandBuilder } = require('discord.js');
const { tournamentService } = require('../../services/tournamentService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tournament-bracket')
    .setDescription('View the bracket of a tournament')
    .addStringOption(option =>
      option.setName('tournament')
        .setDescription('Tournament ID')
        .setRequired(true)
    ),
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament');

    try {
      const bracket = await tournamentService.getBracket(tournamentId);
      if (!bracket) return interaction.reply({ content: '⚠️ Tournament not found or bracket not generated.', ephemeral: true });

      await interaction.reply({ content: `🏆 Bracket for tournament **${tournamentId}**:\n\`\`\`${JSON.stringify(bracket, null, 2)}\`\`\``, ephemeral: true });
    } catch (error) {
      console.error('Error fetching bracket:', error);
      await interaction.reply({ content: '❌ Something went wrong while fetching the bracket.', ephemeral: true });
    }
  }
};

