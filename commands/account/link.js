const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');
const { syncToSite } = require('../../utils/syncToSite');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'link',
  description: 'Link your Discord account to a player',
  async execute(interaction) {
    const discordId = interaction.user.id;
    const playerTag = interaction.options.getString('player_tag');

    let players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));

    const existing = players.find(p => p.discordId === discordId);
    if (existing) {
      return interaction.reply({ content: 'Your account is already linked!', ephemeral: true });
    }

    const player = players.find(p => p.username === playerTag);
    if (!player) {
      return interaction.reply({ content: 'Player not found.', ephemeral: true });
    }

    player.discordId = discordId;

    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    syncToSite('players.json');

    return interaction.reply({ content: `Successfully linked to **${player.username}**!`, ephemeral: true });
  }
};

