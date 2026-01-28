const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../utils/syncToSite');
const { generateBracket } = require('../utils/bracketGen');

const tournamentsPath = path.join(__dirname, '../data/tournaments.json');
const bracketPath = path.join(__dirname, '../data/bracket.json');

function loadTournaments() {
  return JSON.parse(fs.readFileSync(tournamentsPath));
}

function saveTournaments(tournaments) {
  fs.writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
  syncToSite('tournaments.json');
}

exports.tournamentService = {
  signup(tournamentId, userId) {
    const tournaments = loadTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return { success: false, message: 'Tournament not found.' };

    tournament.participants = tournament.participants || [];

    if (tournament.participants.includes(userId)) {
      return { success: false, message: 'Already signed up.' };
    }

    tournament.participants.push(userId);
    saveTournaments(tournaments);

    return { success: true, name: tournament.name };
  },

  generateBracket(tournamentId) {
    const tournaments = loadTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return null;

    const bracket = generateBracket(tournament.participants || []);
    fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));
    syncToSite('bracket.json');

    return tournament.name;
  },

  getTournament(tournamentId) {
    const tournaments = loadTournaments();
    return tournaments.find(t => t.id === tournamentId);
  }
};
