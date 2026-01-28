// commands/matches/report.js
const { SlashCommandBuilder } = require('discord.js');
const matchService = require('../../services/matchService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('Report a match result')
    .addUserOption(option =>
      option.setName('winner')
        .setDescription('Winner of the match')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('loser')
        .setDescription('Loser of the match')
        .setRequired(true)),
  async execute(interaction) {
    const winner = interaction.options.getUser('winner');
    const loser = interaction.options.getUser('loser');

    const match = matchService.addMatch({
      winnerId: winner.id,
      loserId: loser.id,
      timestamp: Date.now(),
    });

    await interaction.reply(`✅ Match recorded: ${winner.username} defeated ${loser.username}`);
  },
};

