const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'verify',
  description: 'Verify your account',

  async execute(interaction) {
    const userId = interaction.user.id;
    const code = interaction.options.getString('code');

    let players;
    try {
      players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read players.json:', err);
      return interaction.reply({
        content: 'There was an error reading player data.',
        ephemeral: true
      });
    }

    const player = players.find(p => p.id === userId);

    if (!player) {
      return interaction.reply({
        content: 'You need to register first!',
        ephemeral: true
      });
    }

    if (player.verified) {
      return interaction.reply({
        content: 'You are already verified!',
        ephemeral: true
      });
    }

    if (player.verificationCode !== code) {
      return interaction.reply({
        content: 'Invalid verification code.',
        ephemeral: true
      });
    }

    player.verified = true;

    try {
      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    } catch (err) {
      console.error('❌ Failed to write players.json:', err);
      return interaction.reply({
        content: 'There was an error saving your verification.',
        ephemeral: true
      });
    }

    try {
      syncToSite('players.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ syncToSite failed:', err);
    }

    return interaction.reply({
      content: 'Account verified successfully!',
      ephemeral: true
    });
  }
};

