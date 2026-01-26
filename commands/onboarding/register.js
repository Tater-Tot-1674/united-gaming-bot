const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register your KartKings account")
    .addStringOption(option =>
      option.setName("name")
        .setDescription("Your KartKings username")
        .setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const userId = interaction.user.id;

    const players = JSON.parse(fs.readFileSync("./data/players.json"));

    if (players.find(p => p.discord_id === userId)) {
      return interaction.reply({ content: "You are already registered!", ephemeral: true });
    }

    players.push({
      discord_id: userId,
      discord_name: interaction.user.tag,
      kart_name: name,
      wins: 0,
      losses: 0,
      kos: 0,
      accuracy: 0,
      rival: null,
      rank: "Bronze"
    });

    fs.writeFileSync("./data/players.json", JSON.stringify(players, null, 2));

    await interaction.reply(`Registered as **${name}**!`);
  }
};

