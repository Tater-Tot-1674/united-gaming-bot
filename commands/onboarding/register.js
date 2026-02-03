const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');
const { syncToSite } = require('../../utils/syncToSite');
const { WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants');

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
        // Push updated players.json to website repo
        try {
          syncToSite('players.json', WEBSITE_REPO, GITHUB_TOKEN);
        } catch (err) {
          console.error('❌ syncToSite failed:', err);
        }

        return interaction.reply({
          content: `🎉 Welcome **${username}**! You have joined the **${team}** team.`,
          ephemeral: true
        });
      }

      return interaction.reply({
        content: `⚠️ ${result.message}`,
        ephemeral: true
      });

    } catch (error) {
      console.error('Error registering player:', error);
      return interaction.reply({
        content: '❌ Something went wrong during registration.',
        ephemeral: true
      });
    }
  }
};

