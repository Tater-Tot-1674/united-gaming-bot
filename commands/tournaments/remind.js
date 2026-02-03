const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');

const tournamentsPath = path.join(__dirname, '../../', DATA_PATHS.TOURNAMENTS);

module.exports = {
  name: 'remind',
  description: 'Remind participants of a tournament',

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

    const mentions = (tournament.participants || [])
      .map(id => `<@${id}>`)
      .join(' ');

    return interaction.reply({
      content: `⏰ **Reminder:** ${tournament.name} starts soon!\n${mentions}`,
      ephemeral: false
    });
  }
};

