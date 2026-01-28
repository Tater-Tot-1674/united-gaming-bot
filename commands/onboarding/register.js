// commands/onboarding/register.js
const { SlashCommandBuilder } = require('discord.js');
const playerService = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register yourself as a new player')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Your in-game username')
        .setRequired(true)),
  async execute(interaction) {
    const username = interaction.options.getString('username');

    const existing = playerService.getPlayer(interaction.user.id);
    if (existing) {
      return interaction.reply({ content: '❌ You are already registered!', ephemeral: true });
    }

    playerService.addPlayer({ id: interaction.user.id, username, xp: 0, wins: 0, losses: 0 });
    await interaction.reply(`✅ Registered successfully as **${username}**!`);
  },
};

