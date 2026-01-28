import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('faq')
    .setDescription('View frequently asked questions'),

  async execute(interaction) {
    await interaction.reply({
      content: "📚 **FAQ Overview:**\n- `/faq-general` → General questions\n- `/faq-matches` → Match rules & reporting\n- `/faq-tournaments` → Tournament questions\n- `/faq-account` → Account & profile questions",
      ephemeral: true
    });
  }
};
