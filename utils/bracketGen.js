const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "../data/players.json");
const tournamentsPath = path.join(__dirname, "../data/tournaments.json");
const bracketPath = path.join(__dirname, "../data/bracket.json");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateBracket(tournamentId) {
  const players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
  const tournaments = JSON.parse(fs.readFileSync(tournamentsPath, "utf8"));

  const tournament = tournaments.find(t => t.id === tournamentId);
  if (!tournament) return null;

  const participants = shuffle(tournament.players);

  const bracket = [];
  let round = 1;
  let current = participants;

  while (current.length > 1) {
    const matches = [];

    for (let i = 0; i < current.length; i += 2) {
      matches.push({
        round,
        player1: current[i],
        player2: current[i + 1] || null,
        winner: null
      });
    }

    bracket.push({ round, matches });
    current = new Array(Math.ceil(current.length / 2)).fill(null);
    round++;
  }

  fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));
  return bracket;
}

module.exports = { generateBracket };

