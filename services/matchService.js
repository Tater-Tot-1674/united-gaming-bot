const fs = require('fs');
const path = require('path');
const { leaderboardCalc } = require('../utils/leaderboardCalc');
const { rankSystem } = require('../utils/rankSystem');
const { githubSync } = require('../utils/githubSync');

const playersPath = path.join(__dirname, '../data/players.json');
const matchesPath = path.join(__dirname, '../data/matches.json');

function load(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const XP_WIN = 25;
const XP_LOSS = 10;

exports.matchService = {

  async recordMatch(playerA, playerB, result) {
    const players = load(playersPath);
    const matches = load(matchesPath);

    const p1 = players.find(p => p.id === playerA.id);
    const p2 = players.find(p => p.id === playerB.id);

    if (!p1 || !p2) throw new Error('Players missing');

    const timestamp = new Date().toISOString();

    // Determine winner/loser
    let winner, loser;

    if (result === 'win') {
      winner = p1;
      loser = p2;
    } else {
      winner = p2;
      loser = p1;
    }

    // Update records
    winner.wins = (winner.wins || 0) + 1;
    loser.losses = (loser.losses || 0) + 1;

    // XP gain
    winner.xp = (winner.xp || 0) + XP_WIN;
    loser.xp = (loser.xp || 0) + XP_LOSS;

    // Rank recalculation
    winner.rank = rankSystem.getRank(winner.xp);
    loser.rank = rankSystem.getRank(loser.xp);

    // Store match history
    matches.push({
      id: matches.length + 1,
      p1: p1.username,
      p2: p2.username,
      winner: winner.username,
      timestamp
    });

    save(playersPath, players);
    save(matchesPath, matches);

    // Recalculate leaderboards
    leaderboardCalc.update();

    // Push data to website repo
    await githubSync.sync();

    return true;
  }
};

