const fs = require('fs');
const path = require('path');
const { syncToSite } = require('./syncToSite');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../utils/constants');

const playersPath = path.join(__dirname, '../', DATA_PATHS.PLAYERS);
const leaderboardPath = path.join(__dirname, '../', DATA_PATHS.LEADERBOARD_WEEKLY);

function calculateLeaderboard() {
  let players;

  try {
    players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
  } catch {
    players = [];
  }

  const sorted = players
    .sort((a, b) => b.xp - a.xp)
    .map((player, index) => ({
      rank: index + 1,
      name: player.name,
      points: player.xp,
      discordId: player.discordId
    }));

  fs.writeFileSync(leaderboardPath, JSON.stringify(sorted, null, 2));

  try {
    syncToSite('leaderboard_weekly.json', WEBSITE_REPO, GITHUB_TOKEN);
  } catch (err) {
    console.error('❌ Failed to sync leaderboard:', err);
  }
}

module.exports = { calculateLeaderboard };
