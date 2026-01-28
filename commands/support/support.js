import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('support')
    .setDescription('Get help from the KartKings team'),

  async execute(interaction) {
    await interaction.reply({
      content: "📞 **Support Info:**\n- Contact a moderator on Discord for urgent issues.\n- Use `/help` for a full list of commands.\n- Check `/faq` for common questions.\n\nWe’re here to help you dominate the arena!",
      ephemeral: true
    });
  }
};

