import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands and how to use them'),

  async execute(interaction) {
    await interaction.reply({
      content: "🆘 **Help Menu:**\n- `/register` → Create your profile\n- `/profile` → View your stats\n- `/signup` → Join a tournament\n- `/report` → Report a match\n- `/leaderboard` → View rankings\n- `/announce` → Admin announcements",
      ephemeral: true
    });
  }
};

