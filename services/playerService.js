const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../utils/syncToSite');

const playersPath = path.join(__dirname, '../data/players.json');

function loadPlayers() {
  return JSON.parse(fs.readFileSync(playersPath));
}

function savePlayers(players) {
  fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
  syncToSite('players.json'); // 🌍 live site update
}

exports.playerService = {
  getAllPlayers() {
    return loadPlayers();
  },

  getPlayerByDiscord(discordId) {
    const players = loadPlayers();
    return players.find(p => p.discordId === discordId);
  },

  getPlayerByName(name) {
    const players = loadPlayers();
    return players.find(p => p.name.toLowerCase() === name.toLowerCase());
  },

  registerPlayer(discordId, username, team) {
    const players = loadPlayers();

    if (players.find(p => p.discordId === discordId)) {
      return { success: false, message: 'You are already registered.' };
    }

    const newPlayer = {
      id: Date.now().toString(),
      discordId,
      name: username,
      team,
      xp: 0,
      wins: 0,
      losses: 0,
      rank: 'Rookie',
      verified: false
    };

    players.push(newPlayer);
    savePlayers(players);

    return { success: true };
  },

  updateStats(winnerId, loserId) {
    const players = loadPlayers();

    const winner = players.find(p => p.discordId === winnerId);
    const loser = players.find(p => p.discordId === loserId);

    if (!winner || !loser) return;

    winner.wins += 1;
    winner.xp += 25;

    loser.losses += 1;
    loser.xp += 10;

    savePlayers(players);
  }
};
