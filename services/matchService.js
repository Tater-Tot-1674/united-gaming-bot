const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../utils/syncToSite');
const { playerService } = require('./playerService');

const matchesPath = path.join(__dirname, '../data/matches.json');

function loadMatches() {
  return JSON.parse(fs.readFileSync(matchesPath));
}

function saveMatches(matches) {
  fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
  syncToSite('matches.json'); // 🌍 live site update
}

exports.matchService = {
  reportMatch(winnerDiscordId, loserDiscordId) {
    const matches = loadMatches();

    matches.push({
      id: Date.now().toString(),
      winner: winnerDiscordId,
      loser: loserDiscordId,
      date: new Date().toISOString()
    });

    saveMatches(matches);

    // Update player stats
    playerService.updateStats(winnerDiscordId, loserDiscordId);
  },

  getAllMatches() {
    return loadMatches();
  }
};
