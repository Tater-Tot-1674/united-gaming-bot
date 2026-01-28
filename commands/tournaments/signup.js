const { SlashCommandBuilder } = require('discord.js');
const { tournamentService } = require('../../services/tournamentService');
const { playerService } = require('../../services/playerService');
const { toast } = require('../../utils/githubSync');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tournament-signup')
    .setDescription('Sign up for an active tournament')
    .addStringOption(option =>
      option.setName('tournament')
        .setDescription('Tournament ID')
        .setRequired(true)
    ),
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament');
    try {
      const player = await playerService.getPlayerByDiscord(interaction.user.id);
      if (!player) return interaction.reply({ content: '⚠️ You must link your account first using `/link`.', ephemeral: true });

      const success = await tournamentService.addParticipant(tournamentId, player.id);
      if (!success) return interaction.reply({ content: '⚠️ Could not sign up (tournament may be full or closed).', ephemeral: true });

      await interaction.reply({ content: `🎉 You are now signed up for tournament **${tournamentId}**!`, ephemeral: true });
    } catch (error) {
      console.error('Error signing up:', error);
      await interaction.reply({ content: '❌ Something went wrong while signing up.', ephemeral: true });
    }
  }
};


