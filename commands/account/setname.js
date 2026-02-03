const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'setname',
  description: 'Set your in-game name',

  async execute(interaction) {
    const userId = interaction.user.id;
    const newName = interaction.options.getString('name');

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

    let player = players.find(p => p.id === userId);

    if (!player) {
      player = { id: userId, name: newName, verified: false };
      players.push(player);
    } else {
      player.name = newName;
    }

    try {
      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    } catch (err) {
      console.error('❌ Failed to write players.json:', err);
      return interaction.reply({
        content: 'There was an error saving your new name.',
        ephemeral: true
      });
    }

    try {
      syncToSite('players.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ syncToSite failed:', err);
    }

    return interaction.reply({
      content: `Your in-game name is now **${newName}**`,
      ephemeral: true
    });
  }
};


