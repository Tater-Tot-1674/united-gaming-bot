const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { updateLeaderboard } = require('../../utils/leaderboardCalc');
const { updateRank } = require('../../utils/rankSystem');
const { DATA_PATHS } = require('../../config/constants');

const matchesPath = path.join(__dirname, '../../', DATA_PATHS.MATCHES);
const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'report',
  description: 'Report a match result',
  async execute(interaction) {
    const { winnerId, loserId } = interaction.options;

    // Load matches
    const matches = JSON.parse(fs.readFileSync(matchesPath));
    matches.push({
      winner: winnerId,
      loser: loserId,
      date: new Date().toISOString()
    });
    fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
    syncToSite('matches.json');

    // Update leaderboard
    const players = JSON.parse(fs.readFileSync(playersPath));
    updateLeaderboard(players, winnerId, loserId);
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    syncToSite('players.json');

    // Update ranks
    updateRank(players, winnerId);
    updateRank(players, loserId);
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    syncToSite('players.json');

    return interaction.reply({ content: 'Match reported and leaderboard updated!', ephemeral: true });
  }
};


