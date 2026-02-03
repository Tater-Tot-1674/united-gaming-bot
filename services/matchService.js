const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../utils/syncToSite');
const { playerService } = require('./playerService');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../utils/constants');

const matchesPath = path.join(__dirname, '../', DATA_PATHS.TOURNAMENTS); // or MATCHES if you add it

function loadMatches() {
  try {
    return JSON.parse(fs.readFileSync(matchesPath, 'utf8'));
  } catch {
    return [];
  }
}

function saveMatches(matches) {
  fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));
  syncToSite('tournaments.json', WEBSITE_REPO, GITHUB_TOKEN);
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
