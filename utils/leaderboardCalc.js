const fs = require("fs");
const path = require("path");

const weeklyPath = path.join(__dirname, "../data/leaderboard_weekly.json");
const monthlyPath = path.join(__dirname, "../data/leaderboard_monthly.json");

/* ------------------------- */
/* 🧱 INTERNAL FILE HANDLER  */
/* ------------------------- */

function loadBoard(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveBoard(filePath, board) {
  fs.writeFileSync(filePath, JSON.stringify(board, null, 2));
}

/* ------------------------- */
/* 🏆 PLAYER STAT UPDATES    */
/* ------------------------- */

function ensurePlayer(board, playerId) {
  if (!board[playerId]) {
    board[playerId] = {
      wins: 0,
      losses: 0,
      games: 0,
      winrate: 0
    };
  }
}

function recalcWinrate(player) {
  player.winrate = player.games > 0
    ? Number(((player.wins / player.games) * 100).toFixed(1))
    : 0;
}

/* ------------------------- */
/* ➕ ADD WIN                 */
/* ------------------------- */

function addWin(playerId) {
  const weekly = loadBoard(weeklyPath);
  const monthly = loadBoard(monthlyPath);

  [weekly, monthly].forEach(board => {
    ensurePlayer(board, playerId);
    board[playerId].wins += 1;
    board[playerId].games += 1;
    recalcWinrate(board[playerId]);
  });

  saveBoard(weeklyPath, weekly);
  saveBoard(monthlyPath, monthly);
}

/* ------------------------- */
/* ➖ ADD LOSS                */
/* ------------------------- */

function addLoss(playerId) {
  const weekly = loadBoard(weeklyPath);
  const monthly = loadBoard(monthlyPath);

  [weekly, monthly].forEach(board => {
    ensurePlayer(board, playerId);
    board[playerId].losses += 1;
    board[playerId].games += 1;
    recalcWinrate(board[playerId]);
  });

  saveBoard(weeklyPath, weekly);
  saveBoard(monthlyPath, monthly);
}

/* ------------------------- */
/* 📈 GET SORTED BOARD       */
/* ------------------------- */

function getLeaderboard(type = "weekly") {
  const filePath = type === "monthly" ? monthlyPath : weeklyPath;
  const board = loadBoard(filePath);

  const sorted = Object.entries(board)
    .map(([id, stats]) => ({ id, ...stats }))
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.winrate - a.winrate;
    });

  return sorted;
}

/* ------------------------- */
/* 🔄 RESET WEEKLY/MONTHLY   */
/* ------------------------- */

function resetLeaderboard(type = "weekly") {
  const filePath = type === "monthly" ? monthlyPath : weeklyPath;
  saveBoard(filePath, {});
}

/* ------------------------- */
/* 📦 EXPORTS                */
/* ------------------------- */

module.exports = {
  addWin,
  addLoss,
  getLeaderboard,
  resetLeaderboard
};
