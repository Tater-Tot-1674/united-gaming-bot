const { SlashCommandBuilder } = require('discord.js');
const { playerService } = require('../../services/playerService');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setname')
    .setDescription('Set or update your KartKings display name')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Your new display name')
        .setRequired(true)
    ),
  async execute(interaction) {
    const newName = interaction.options.getString('name');

    try {
      const result = await playerService.updateName(interaction.user.id, newName);

      if (result.success) {
        await interaction.reply({ content: `✅ Your display name has been updated to **${newName}**!`, ephemeral: true });
      } else {
        await interaction.reply({ content: `⚠️ ${result.message}`, ephemeral: true });
      }
    } catch (error) {
      console.error('Error updating display name:', error);
      await interaction.reply({ content: '❌ Something went wrong while updating your name.', ephemeral: true });
    }
  }
};

