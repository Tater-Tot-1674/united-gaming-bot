// services/playerService.js
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/players.json');

function loadPlayers() {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
}

function savePlayers(players) {
  fs.writeFileSync(filePath, JSON.stringify(players, null, 2));
}

function getPlayer(id) {
  const players = loadPlayers();
  return players[id] || null;
}

function addPlayer(id, data) {
  const players = loadPlayers();
  players[id] = data;
  savePlayers(players);
}

function updatePlayer(id, data) {
  const players = loadPlayers();
  players[id] = { ...(players[id] || {}), ...data };
  savePlayers(players);
}

module.exports = {
  loadPlayers,
  savePlayers,
  getPlayer,
  addPlayer,
  updatePlayer,
};

