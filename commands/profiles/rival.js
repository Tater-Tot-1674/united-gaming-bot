const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'rival',
  description: 'View your top rivals',
  async execute(interaction) {
    const userId = interaction.user.id;
    const players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
    const me = players.find(p => p.discordId === userId);

    if (!me) return interaction.reply({ content: 'You are not registered.', ephemeral: true });

    const rivals = players
      .filter(p => p.username !== me.username)
      .sort((a, b) => b.points - a.points)
      .slice(0, 3)
      .map(p => `${p.username} — ${p.points} pts`)
      .join('\n');

    return interaction.reply({ content: `⚔️ **Your Top Rivals:**\n${rivals}`, ephemeral: false });
  }
};


