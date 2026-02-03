const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');

const leaderboardPath = path.join(__dirname, '../../', DATA_PATHS.LEADERBOARD_WEEKLY);

module.exports = {
  name: 'rank',
  description: 'View the weekly leaderboard',

  async execute(interaction) {
    let leaderboard;

    try {
      leaderboard = JSON.parse(fs.readFileSync(leaderboardPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read leaderboard:', err);
      return interaction.reply({ content: 'Error loading leaderboard.', ephemeral: true });
    }

    const topPlayers = leaderboard
      .slice(0, 10)
      .map((p, i) => `${i + 1}. ${p.username} — ${p.points} pts`)
      .join('\n');

    return interaction.reply({
      content: `🏆 **Weekly Leaderboard:**\n${topPlayers}`,
      ephemeral: false
    });
  }
};

