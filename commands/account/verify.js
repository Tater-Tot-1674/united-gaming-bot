const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { DATA_PATHS } = require('../../config/constants');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'verify',
  description: 'Verify your account',
  async execute(interaction) {
    const userId = interaction.user.id;
    const code = interaction.options.getString('code');

    const players = JSON.parse(fs.readFileSync(playersPath));
    const player = players.find(p => p.id === userId);

    if (!player)
      return interaction.reply({ content: 'You need to register first!', ephemeral: true });
    if (player.verified)
      return interaction.reply({ content: 'You are already verified!', ephemeral: true });

    if (player.verificationCode === code) {
      player.verified = true;
      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
      syncToSite('players.json'); // 🔥 live update
      return interaction.reply({ content: 'Account verified successfully!', ephemeral: true });
    } else {
      return interaction.reply({ content: 'Invalid verification code.', ephemeral: true });
    }
  }
};

