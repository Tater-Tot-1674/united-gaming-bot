// commands/onboarding/register.js
const { SlashCommandBuilder } = require('discord.js');
const playerService = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register as a new player'),
  async execute(interaction) {
    const id = interaction.user.id;
    const existing = playerService.getPlayer(id);

    if (existing) {
      return interaction.reply({ content: '❌ You are already registered!', ephemeral: true });
    }

    playerService.addPlayer(id, {
      username: interaction.user.username,
      xp: 0,
      rank: 'Rookie',
    });

    await interaction.reply({ content: `✅ Registered ${interaction.user.username}! Welcome to KartKings!`, ephemeral: true });
  },
};


