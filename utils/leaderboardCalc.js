const fs = require('fs');
const path = require('path');
const { syncToSite } = require('./syncToSite');

const playersPath = path.join(__dirname, '../data/players.json');
const leaderboardPath = path.join(__dirname, '../data/leaderboard_weekly.json');

function calculateLeaderboard() {
  const players = JSON.parse(fs.readFileSync(playersPath));

  const sorted = players
    .sort((a, b) => b.xp - a.xp)
    .map((player, index) => ({
      rank: index + 1,
      name: player.name,
      points: player.xp,
      discordId: player.discordId
    }));

  fs.writeFileSync(leaderboardPath, JSON.stringify(sorted, null, 2));
  syncToSite('leaderboard_weekly.json');
}

module.exports = { calculateLeaderboard };
