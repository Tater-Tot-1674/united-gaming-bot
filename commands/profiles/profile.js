const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your KartKings profile"),

  async execute(interaction) {
    const players = JSON.parse(fs.readFileSync("./data/players.json"));
    const player = players.find(p => p.discord_id === interaction.user.id);

    if (!player) {
      return interaction.reply({ content: "You are not registered. Use /register", ephemeral: true });
    }

    await interaction.reply(
      `🏁 **${player.kart_name}**\nWins: ${player.wins}\nLosses: ${player.losses}\nKOs: ${player.kos}\nRank: ${player.rank}`
    );
  }
};

