// commands/tournaments/signup.js
const { SlashCommandBuilder } = require('discord.js');
const tournamentService = require('../../services/tournamentService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('signup')
    .setDescription('Join a tournament')
    .addStringOption(option =>
      option.setName('tournament')
        .setDescription('Tournament ID')
        .setRequired(true)),
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament');
    const tournament = tournamentService.addParticipant(tournamentId, interaction.user.id);

    if (!tournament) {
      return interaction.reply({ content: '❌ Tournament not found!', ephemeral: true });
    }

    await interaction.reply(`✅ You have joined the tournament: ${tournament.name}`);
  },
};

