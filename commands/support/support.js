const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get help from the KartKings team'),

  async execute(interaction) {
    return interaction.reply({
      content:
        "📞 **Support Info:**\n" +
        "- Contact a moderator on Discord for urgent issues.\n" +
        "- Use `/help` for a full list of commands.\n" +
        "- Check `/faq` for common questions.\n\n" +
        "We’re here to help you dominate the arena!",
      ephemeral: true
    });
  }
};
