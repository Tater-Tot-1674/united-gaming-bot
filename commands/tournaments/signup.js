const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');

const tournamentsPath = path.join(__dirname, '../../data/tournaments.json');

module.exports = {
  name: 'signup',
  description: 'Sign up for a tournament',
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament_id');
    const userId = interaction.user.id;

    const tournaments = JSON.parse(fs.readFileSync(tournamentsPath));
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return interaction.reply({ content: 'Tournament not found', ephemeral: true });

    if (tournament.participants?.includes(userId)) {
      return interaction.reply({ content: 'You are already signed up!', ephemeral: true });
    }

    tournament.participants = tournament.participants || [];
    tournament.participants.push(userId);

    fs.writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));
    syncToSite('tournaments.json'); // 🔥 live update

    return interaction.reply({ content: `You have joined ${tournament.name}!`, ephemeral: true });
  }
};



