const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { updateLeaderboard } = require('../../utils/leaderboardCalc');
const { updateRank } = require('../../utils/rankSystem');

const dataPath = path.join(__dirname, '../../data/matches.json');
const playersPath = path.join(__dirname, '../../data/players.json');

module.exports = {
  name: 'report',
  description: 'Report a match result',
  async execute(interaction) {
    const { winnerId, loserId } = interaction.options;

    // Load matches
    const matches = JSON.parse(fs.readFileSync(dataPath));
    matches.push({
      winner: winnerId,
      loser: loserId,
      date: new Date().toISOString()
    });
    fs.writeFileSync(dataPath, JSON.stringify(matches, null, 2));
    syncToSite('matches.json'); // 🔥 live update

    // Update leaderboard
    const players = JSON.parse(fs.readFileSync(playersPath));
    updateLeaderboard(players, winnerId, loserId);
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    syncToSite('players.json'); // 🔥 live update

    // Update ranks
    updateRank(players, winnerId);
    updateRank(players, loserId);
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    syncToSite('players.json'); // 🔥 live update

    return interaction.reply({ content: 'Match reported and leaderboard updated!', ephemeral: true });
  }
};


