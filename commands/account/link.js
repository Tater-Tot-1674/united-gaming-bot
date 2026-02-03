const path = require('path');
const fs = require('fs');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants');
const { syncToSite } = require('../../utils/syncToSite');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'link',
  description: 'Link your Discord account to a player',

  async execute(interaction) {
    const discordId = interaction.user.id;
    const playerTag = interaction.options.getString('player_tag');

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

    const existing = players.find(p => p.discordId === discordId);
    if (existing) {
      return interaction.reply({
        content: 'Your account is already linked!',
        ephemeral: true
      });
    }

    const player = players.find(p => p.username === playerTag);
    if (!player) {
      return interaction.reply({
        content: 'Player not found.',
        ephemeral: true
      });
    }

    player.discordId = discordId;

    try {
      fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));
    } catch (err) {
      console.error('❌ Failed to write players.json:', err);
      return interaction.reply({
        content: 'There was an error saving your link.',
        ephemeral: true
      });
    }

    try {
      syncToSite('players.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ syncToSite failed:', err);
    }

    return interaction.reply({
      content: `Successfully linked to **${player.username}**!`,
      ephemeral: true
    });
  }
};


