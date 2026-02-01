const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');
const { generateBracket } = require('../../utils/bracketGen');
const { syncToSite } = require('../../utils/syncToSite');

const tournamentsPath = path.join(__dirname, '../../', DATA_PATHS.TOURNAMENTS);
const bracketPath = path.join(__dirname, '../../', DATA_PATHS.BRACKET);

module.exports = {
  name: 'bracket',
  description: 'Generate tournament bracket',
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament_id');

    const tournaments = JSON.parse(fs.readFileSync(tournamentsPath, 'utf8'));
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return interaction.reply({ content: 'Tournament not found', ephemeral: true });

    const bracket = generateBracket(tournament.participants || []);
    fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));
    syncToSite('bracket.json');

    return interaction.reply({ content: `Bracket for ${tournament.name} generated!`, ephemeral: true });
  }
};


