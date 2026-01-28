// commands/profiles/profile.js
const { SlashCommandBuilder } = require('discord.js');
const playerService = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View your profile or another player\'s')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Player to view')
        .setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const player = playerService.getPlayer(user.id);

    if (!player) return interaction.reply({ content: '❌ Player not found!', ephemeral: true });

    await interaction.reply({
      content: `**${user.username}'s Profile**\nXP: ${player.xp}\nWins: ${player.wins}\nLosses: ${player.losses}`,
    });
  },
};

