const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const rankSystem = require("../../utils/rankSystem");

const dataPath = path.join(__dirname, "../../data/players.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your KartKings profile or someone else's")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Choose a player to view")
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    let players = [];
    try {
      players = JSON.parse(fs.readFileSync(dataPath, "utf8"));
    } catch (err) {
      console.error("Error reading players.json", err);
      return interaction.reply({ content: "⚠️ Could not load player data.", ephemeral: true });
    }

    const player = players.find(p => p.id === user.id);

    if (!player) {
      return interaction.reply({
        content: `❌ Player <@${user.id}> not found in the system.`,
        ephemeral: true
      });
    }

    const levelInfo = rankSystem.getLevel(player.xp);

    const embed = new EmbedBuilder()
      .setTitle(`🎮 ${user.username}'s Profile`)
      .setThumbnail(user.displayAvatarURL())
      .setColor("#6B46C1")
      .addFields(
        { name: "🏅 Rank", value: levelInfo.rank, inline: true },
        { name: "💎 Level", value: `${levelInfo.level}`, inline: true },
        { name: "⭐ XP", value: `${player.xp}`, inline: true },
        { name: "🔥 Wins", value: `${player.wins}`, inline: true },
        { name: "💀 Losses", value: `${player.losses}`, inline: true },
        { name: "📊 Win Rate", value: `${player.winrate}%`, inline: true },
        { name: "⚔️ Rivals Defeated", value: `${player.rivalsDefeated || 0}`, inline: true }
      )
      .setFooter({ text: "KartKings Competitive System" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};


