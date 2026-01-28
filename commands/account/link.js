// commands/onboarding/verify.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your account with KartKings site')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('Verification code from the site')
        .setRequired(true)),
  async execute(interaction) {
    const code = interaction.options.getString('code');

    // Placeholder logic: in future, match with site data
    if (code === '1234') {
      await interaction.reply({ content: '✅ Verification successful!', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Invalid verification code.', ephemeral: true });
    }
  },
};

