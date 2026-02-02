const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { DATA_PATHS } = require('../../utils/constants');  // fixed path
const { WEBSITE_REPO, BOT_USER_ID, DISCORD_TOKEN, GITHUB_TOKEN, RENDER_URL } = require('../../config/constants'); // ✅ import constants

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'setname',
  description: 'Set your in-game name',
  async execute(interaction) {
    const userId = interaction.user.id;
    const newName = interaction.options.getString('name');

    const players = JSON.parse(fs.readFileSync(playersPath));
    let player = players.find(p => p.id === userId);

    if (!player) {
      player = { id: userId, name: newName, verified: false };
      players.push(player);
    } else {
      player.name = newName;
    }

    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));

    // 🔥 live update with GitHub repo token
    syncToSite('players.json', WEBSITE_REPO, GITHUB_TOKEN); 

    return interaction.reply({ content: `Your in-game name is now ${newName}`, ephemeral: true });
  }
};


