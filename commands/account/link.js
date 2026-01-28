const fs = require('fs');
const path = require('path');
const { syncToSite } = require('../../utils/syncToSite');

const playersPath = path.join(__dirname, '../../data/players.json');

module.exports = {
  name: 'link',
  description: 'Link your Discord to your profile',
  async execute(interaction) {
    const userId = interaction.user.id;
    const profileName = interaction.options.getString('profile');

    const players = JSON.parse(fs.readFileSync(playersPath));
    const existing = players.find(p => p.name.toLowerCase() === profileName.toLowerCase());

    if (!existing) return interaction.reply({ content: 'Profile not found.', ephemeral: true });

    existing.discordId = userId;
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    syncToSite('players.json'); // 🔥 live update

    return interaction.reply({ content: `Profile ${profileName} linked!`, ephemeral: true });
  }
};

