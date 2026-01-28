// commands/leaderboard/leaderboard.js
const { SlashCommandBuilder } = require('discord.js');
const playerService = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the top players'),
  async execute(interaction) {
    const topPlayers = playerService.getLeaderboard({ top: 10 });

    if (topPlayers.length === 0) return interaction.reply('No players yet!');

    let leaderboardText = '**🏆 Leaderboard**\n';
    topPlayers.forEach((p, i) => {
      leaderboardText += `\`${i + 1}.\` ${p.username} — XP: ${p.xp}, Wins: ${p.wins}, Losses: ${p.losses}\n`;
    });

    await interaction.reply(leaderboardText);
  },
};
