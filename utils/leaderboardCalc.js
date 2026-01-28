const fs = require("fs");
const path = require("path");
const { rankSystem } = require("./rankSystem");

const playersPath = path.join(__dirname, "../data/players.json");
const weeklyPath = path.join(__dirname, "../data/leaderboard_weekly.json");
const monthlyPath = path.join(__dirname, "../data/leaderboard_monthly.json");

function calculateLeaderboards() {
  const players = JSON.parse(fs.readFileSync(playersPath, "utf8"));

  const playerArray = Object.values(players);

  const formatted = playerArray.map(player => ({
    id: player.id,
    discord: player.discord,
    name: player.name || "Unknown",
    xp: player.xp || 0,
    wins: player.wins || 0,
    losses: player.losses || 0,
    rank: rankSystem.getRank(player.xp)
  }));

  // 🥇 Sort by XP (main ranking)
  formatted.sort((a, b) => b.xp - a.xp);

  const leaderboard = formatted.map((player, index) => ({
    position: index + 1,
    ...player
  }));

  // Save both (you can separate logic later)
  fs.writeFileSync(weeklyPath, JSON.stringify(leaderboard, null, 2));
  fs.writeFileSync(monthlyPath, JSON.stringify(leaderboard, null, 2));

  return leaderboard;
}

module.exports = { calculateLeaderboards };

