const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const leaderboardCalc = require("../../utils/leaderboardCalc");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the KartKings leaderboard")
    .addStringOption(option =>
      option.setName("type")
        .setDescription("Choose leaderboard type")
        .setRequired(true)
        .addChoices(
          { name: "Weekly", value: "weekly" },
          { name: "Monthly", value: "monthly" }
        )
    ),

  async execute(interaction) {
    const type = interaction.options.getString("type");

    const leaderboard = leaderboardCalc.getLeaderboard(type);

    if (leaderboard.length === 0) {
      return interaction.reply({
        content: "📉 No matches have been recorded yet!",
        ephemeral: true
      });
    }

    const medal = ["🥇", "🥈", "🥉"];

    let description = "";

    leaderboard.slice(0, 10).forEach((player, index) => {
      const place = medal[index] || `#${index + 1}`;
      description += `${place} <@${player.id}> — **${player.wins}W-${player.losses}L** (${player.winrate}% WR)\n`;
    });

    const embed = new EmbedBuilder()
      .setTitle(`🏆 ${type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard`)
      .setColor("#FFD700")
      .setDescription(description)
      .setFooter({ text: "KartKings Competitive System" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
