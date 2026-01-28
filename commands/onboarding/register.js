const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register as a new player in KartKings')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Your in-game display name')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('team')
        .setDescription('Choose your starting team')
        .setRequired(true)
        .addChoices(
          { name: 'Red', value: 'red' },
          { name: 'Blue', value: 'blue' },
          { name: 'Green', value: 'green' },
          { name: 'Yellow', value: 'yellow' },
          { name: 'Purple', value: 'purple' },
          { name: 'Orange', value: 'orange' }
        )
    ),
  async execute(interaction) {
    const username = interaction.options.getString('username');
    const team = interaction.options.getString('team');

    try {
      const result = await playerService.registerPlayer(interaction.user.id, username, team);

      if (result.success) {
        await interaction.reply({ content: `🎉 Welcome **${username}**! You have joined the **${team}** team.`, ephemeral: true });
      } else {
        await interaction.reply({ content: `⚠️ ${result.message}`, ephemeral: true });
      }
    } catch (error) {
      console.error('Error registering player:', error);
      await interaction.reply({ content: '❌ Something went wrong during registration.', ephemeral: true });
    }
  }
};


