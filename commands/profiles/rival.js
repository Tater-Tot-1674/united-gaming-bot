const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');

const playersPath = path.join(__dirname, '../../', DATA_PATHS.PLAYERS);

module.exports = {
  name: 'rival',
  description: 'View your top rivals',

  async execute(interaction) {
    const userId = interaction.user.id;

    let players;
    try {
      players = JSON.parse(fs.readFileSync(playersPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read players.json:', err);
      return interaction.reply({ content: 'Error loading player data.', ephemeral: true });
    }

    const me = players.find(p => p.id === userId);

    if (!me) {
      return interaction.reply({
        content: 'You are not registered.',
        ephemeral: true
      });
    }

    const rivals = players
      .filter(p => p.id !== userId)
      .sort((a, b) => b.points - a.points)
      .slice(0, 3)
      .map(p => `${p.name} — ${p.points} pts`)
      .join('\n');

    return interaction.reply({
      content: `⚔️ **Your Top Rivals:**\n${rivals}`,
      ephemeral: false
    });
  }
};



