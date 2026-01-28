const fs = require('fs');
const path = require('path');
const { syncToSite } = require('./syncToSite');

const weeklyPath = path.join(__dirname, '../data/leaderboard_weekly.json');
const monthlyPath = path.join(__dirname, '../data/leaderboard_monthly.json');

function updateLeaderboard(players, winnerId, loserId) {
  const winner = players.find(p => p.id === winnerId);
  const loser = players.find(p => p.id === loserId);

  // Example scoring
  winner.wins = (winner.wins || 0) + 1;
  loser.losses = (loser.losses || 0) + 1;

  // Sort by wins
  const sortedWeekly = [...players].sort((a, b) => (b.wins || 0) - (a.wins || 0));
  fs.writeFileSync(weeklyPath, JSON.stringify(sortedWeekly, null, 2));
  syncToSite('leaderboard_weekly.json');

  const sortedMonthly = [...players].sort((a, b) => (b.wins || 0) - (a.wins || 0));
  fs.writeFileSync(monthlyPath, JSON.stringify(sortedMonthly, null, 2));
  syncToSite('leaderboard_monthly.json');
}

module.exports = { updateLeaderboard };

