const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Get started with KartKings'),

  async execute(interaction) {
    return interaction.reply({
      content:
        "🏁 **Getting Started:**\n" +
        "1. `/register` → Create your player profile\n" +
        "2. `/quickplay` → Join a match\n" +
        "3. `/profile` → Check your stats\n" +
        "4. `/signup` → Enter tournaments\n\n" +
        "Follow these steps and start climbing the ranks!",
      ephemeral: true
    });
  }
};
