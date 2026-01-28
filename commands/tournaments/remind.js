const { SlashCommandBuilder } = require('discord.js');
const { tournamentService } = require('../../services/tournamentService');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tournament-remind')
    .setDescription('Send reminders to participants of a tournament')
    .addStringOption(option =>
      option.setName('tournament')
        .setDescription('Tournament ID')
        .setRequired(true)
    ),
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament');

    try {
      const participants = await tournamentService.getParticipants(tournamentId);
      if (!participants || participants.length === 0) return interaction.reply({ content: '⚠️ No participants found.', ephemeral: true });

      for (const pid of participants) {
        const user = await playerService.getPlayerDiscordUser(pid);
        if (user) user.send(`⏰ Reminder: Tournament **${tournamentId}** is starting soon!`);
      }

      await interaction.reply({ content: `✅ Reminders sent to all participants of **${tournamentId}**.`, ephemeral: true });
    } catch (error) {
      console.error('Error sending reminders:', error);
      await interaction.reply({ content: '❌ Something went wrong while sending reminders.', ephemeral: true });
    }
  }
};

