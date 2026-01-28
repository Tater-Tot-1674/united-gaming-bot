const fs = require("fs");
const path = require("path");

const leaderboardPath = path.join(__dirname, "../data/leaderboard_weekly.json");

function addWin(playerId) {
  let leaderboard = JSON.parse(fs.readFileSync(leaderboardPath, "utf8"));

  if (!leaderboard[playerId]) {
    leaderboard[playerId] = { wins: 0 };
  }

  leaderboard[playerId].wins += 1;

  fs.writeFileSync(leaderboardPath, JSON.stringify(leaderboard, null, 2));
}

module.exports = { addWin };


