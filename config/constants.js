const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');

const playersPath = path.join(__dirname, '../../data/players.json');

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
    syncToSite('players.json'); // 🔥 live update

    return interaction.reply({ content: `Your in-game name is now ${newName}`, ephemeral: true });
  }
};

