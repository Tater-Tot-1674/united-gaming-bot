const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your profile or another player’s profile')
    .addUserOption(option =>
      option.setName('player')
        .setDescription('Mention a player to view their profile')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('player') || interaction.user;
      const player = await playerService.getPlayerByDiscord(user.id);

      if (!player) return interaction.reply({ content: '⚠️ Player not found.', ephemeral: true });

      await interaction.reply({
        content: `🎮 **${player.username}**'s Profile\n` +
                 `Team: ${player.team || 'None'}\n` +
                 `Wins: ${player.wins || 0}\n` +
                 `Losses: ${player.losses || 0}\n` +
                 `Rank: ${player.rank || 'Unranked'}\n` +
                 `XP: ${player.xp || 0}`,
        ephemeral: true
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      await interaction.reply({ content: '❌ Something went wrong while fetching the profile.', ephemeral: true });
    }
  }
};


