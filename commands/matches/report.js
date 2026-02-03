const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { updateLeaderboard } = require('../../utils/leaderboardCalc');
const { updateRank } = require('../../utils/rankSystem');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants');

const matchesPath = path.join(__dirname, '../../', DATA_PATHS.TOURNAMENTS);
const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'report',
  description: 'Report a match result',

  async execute(interaction) {
    const winnerId = interaction.options.getString('winner');
    const loserId = interaction.options.getString('loser');

    // Load matches
    let matches;
    try {
      matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read matches.json:', err);
      return interaction.reply({ content: 'Error reading match data.', ephemeral: true });
    }

    matches.push({
      winner: winnerId,
      loser: loserId,
      date: new Date().toISOString()
    });

    try {
      fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
      syncToSite('tournaments.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ Failed to write matches.json:', err);
    }

    // Load players
    let players;
    try {
      players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read players.json:', err);
      return interaction.reply({ content: 'Error reading player data.', ephemeral: true });
    }

    // Update leaderboard
    updateLeaderboard(players, winnerId, loserId);

    // Update ranks
    updateRank(players, winnerId);
    updateRank(players, loserId);

    try {
      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
      syncToSite('players.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ Failed to write players.json:', err);
    }

    return interaction.reply({
      content: 'Match reported and leaderboard updated!',
      ephemeral: true
    });
  }
};


