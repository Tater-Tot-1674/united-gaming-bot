const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');

const tournamentsPath = path.join(__dirname, '../../data/tournaments.json');

module.exports = {
  name: 'remind',
  description: 'Remind participants of a tournament',
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament_id');
    const tournaments = JSON.parse(fs.readFileSync(tournamentsPath));
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return interaction.reply({ content: 'Tournament not found', ephemeral: true });

    const mentions = (tournament.participants || []).map(id => `<@${id}>`).join(' ');
    return interaction.reply({ content: `Reminder: ${tournament.name} starts soon! ${mentions}`, ephemeral: false });
  }
};


