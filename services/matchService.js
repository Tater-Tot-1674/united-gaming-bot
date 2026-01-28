// services/matchService.js
const fs = require('fs');
const path = require('path');
const playerService = require('./playerService');

const filePath = path.join(__dirname, '../data/matches.json');

function loadMatches() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function saveMatches(matches) {
  fs.writeFileSync(filePath, JSON.stringify(matches, null, 2));
}

function addMatch(matchData) {
  const matches = loadMatches();
  matches.push(matchData);
  saveMatches(matches);

  // Update player stats
  const winner = playerService.getPlayer(matchData.winnerId);
  const loser = playerService.getPlayer(matchData.loserId);

  if (winner) {
    playerService.updatePlayer(matchData.winnerId, {
      wins: (winner.wins || 0) + 1,
      xp: (winner.xp || 0) + 10,
    });
  }

  if (loser) {
    playerService.updatePlayer(matchData.loserId, {
      losses: (loser.losses || 0) + 1,
      xp: (loser.xp || 0) + 2,
    });
  }

  return matchData;
}

module.exports = {
  loadMatches,
  saveMatches,
  addMatch,
};

