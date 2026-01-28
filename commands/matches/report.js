const fs = require("fs");
const path = require("path");
const { calculateLeaderboards } = require("../../utils/leaderboardCalc");
const { rankSystem } = require("../../utils/rankSystem");

const playersPath = path.join(__dirname, "../../data/players.json");
const matchesPath = path.join(__dirname, "../../data/matches.json");

module.exports = {
  name: "report",
  description: "Report a match result",

  async execute(interaction) {
    const winner = interaction.options.getUser("winner");
    const loser = interaction.options.getUser("loser");

    let players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
    let matches = JSON.parse(fs.readFileSync(matchesPath, "utf8"));

    if (!players[winner.id] || !players[loser.id]) {
      return interaction.reply({ content: "Both players must be registered.", ephemeral: true });
    }

    // 🧮 XP logic
    const winXP = 25;
    const lossXP = 10;

    players[winner.id].xp += winXP;
    players[loser.id].xp += lossXP;

    players[winner.id].wins += 1;
    players[loser.id].losses += 1;

    players[winner.id].rank = rankSystem.getRank(players[winner.id].xp);
    players[loser.id].rank = rankSystem.getRank(players[loser.id].xp);

    // 💾 Save players
    fs.writeFileSync(playersPath, JSON.stringify(players, null, 2));

    // 📝 Save match history
    matches.push({
      winner: winner.id,
      loser: loser.id,
      date: new Date().toISOString()
    });

    fs.writeFileSync(matchesPath, JSON.stringify(matches, null, 2));

    // 🏆 Recalculate leaderboard
    calculateLeaderboards();

    interaction.reply(
      `🏁 Match recorded!\n**${winner.username}** defeated **${loser.username}**\n+${winXP} XP / +${lossXP} XP`
    );
  }
};


