// services/playerService.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/players.json');

function loadPlayers() {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function savePlayers(players) {
  fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
}

function getPlayer(id) {
  const players = loadPlayers();
  return players.find(p => p.id === id) || null;
}

function addPlayer(player) {
  const players = loadPlayers();
  if (!players.find(p => p.id === player.id)) {
    players.push({ id: player.id, username: player.username, xp: 0, wins: 0, losses: 0 });
    savePlayers(players);
  }
}

function updatePlayer(id, data) {
  const players = loadPlayers();
  const idx = players.findIndex(p => p.id === id);
  if (idx === -1) return null;
  players[idx] = { ...players[idx], ...data };
  savePlayers(players);
  return players[idx];
}

function getLeaderboard({ type = 'weekly', top = 10 } = {}) {
  // Use the weekly/monthly JSONs if needed; fallback to XP sorting
  const players = loadPlayers();
  return players
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, top);
}

module.exports = {
  loadPlayers,
  savePlayers,
  getPlayer,
  addPlayer,
  updatePlayer,
  getLeaderboard,
};


