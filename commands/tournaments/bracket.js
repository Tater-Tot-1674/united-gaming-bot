const fs = require('fs');
const path = require('path');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants');
const { generateBracket } = require('../../utils/bracketGen');
const { syncToSite } = require('../../utils/syncToSite');

const tournamentsPath = path.join(__dirname, '../../', DATA_PATHS.TOURNAMENTS);
const bracketPath = path.join(__dirname, '../../', DATA_PATHS.BRACKET);

module.exports = {
  name: 'bracket',
  description: 'Generate tournament bracket',

  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament_id');

    let tournaments;
    try {
      tournaments = JSON.parse(fs.readFileSync(tournamentsPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read tournaments.json:', err);
      return interaction.reply({ content: 'Error reading tournament data.', ephemeral: true });
    }

    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) {
      return interaction.reply({ content: 'Tournament not found.', ephemeral: true });
    }

    const bracket = generateBracket(tournament.participants || []);

    try {
      fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));
      syncToSite('bracket.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ Failed to write bracket.json:', err);
    }

    return interaction.reply({
      content: `Bracket for **${tournament.name}** generated!`,
      ephemeral: true
    });
  }
};

