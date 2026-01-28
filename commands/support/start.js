import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('start')
    .setDescription('Get started with KartKings'),

  async execute(interaction) {
    await interaction.reply({
      content: "🏁 **Getting Started:**\n1. `/register` → Create your player profile\n2. `/quickplay` → Join a match\n3. `/profile` → Check your stats\n4. `/signup` → Enter tournaments\n\nFollow these steps and start climbing the ranks!",
      ephemeral: true
    });
  }
};

