const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');
const { DATA_PATHS } = require('../../utils/constants'); 
const { WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants'); 

// Path to players.json
const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'setname',
  description: 'Set your in-game name',

  async execute(interaction) {
    const userId = interaction.user.id;
    const newName = interaction.options.getString('name');

    // Load players.json
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

    // Find or create player entry
    let player = players.find(p => p.id === userId);

    if (!player) {
      player = { id: userId, name: newName, verified: false };
      players.push(player);
    } else {
      player.name = newName;
    }

    // Save updated file
    try {
      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    } catch (err) {
      console.error('❌ Failed to write players.json:', err);
      return interaction.reply({
        content: 'There was an error saving your new name.',
        ephemeral: true
      });
    }

    // Sync to website repo
    try {
      syncToSite('players.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ syncToSite failed:', err);
      // Still reply — syncing is optional for user experience
    }

    return interaction.reply({
      content: `Your in-game name is now **${newName}**`,
      ephemeral: true
    });
  }
};

