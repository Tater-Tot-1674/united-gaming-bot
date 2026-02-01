const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');
const { syncToSite } = require('../../utils/syncToSite');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'link',
  description: 'Link your Discord account to a player profile',
  async execute(interaction) {
    try {
      const discordId = interaction.user.id;

      let players = JSON.parse(fs.readFileSync(playersPath));

      const player = players.find(p => p.discordId === discordId);
      if (!player) {
        return interaction.reply({ content: '⚠️ No player found to link.', ephemeral: true });
      }

      player.discordLinked = true;

      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
      syncToSite(DATA_PATHS.PLAYERS);

      return interaction.reply({ content: '✅ Your account has been linked!', ephemeral: true });
    } catch (err) {
      console.error('Error linking account:', err);
      return interaction.reply({ content: '❌ Something went wrong while linking.', ephemeral: true });
    }
  }
};

