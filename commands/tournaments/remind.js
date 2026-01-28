const fs = require("fs");
const path = require("path");

const bracketPath = path.join(__dirname, "../../data/bracket.json");

module.exports = {
  name: "remind",
  description: "Remind players about their matches",

  async execute(interaction) {
    const bracket = JSON.parse(fs.readFileSync(bracketPath, "utf8"));

    if (!bracket.rounds.length)
      return interaction.reply({ content: "No active bracket.", ephemeral: true });

    const round = bracket.rounds[0];

    let msg = "⏰ **Match Reminder!**\nPlayers, play your matches:\n\n";

    round.forEach(match => {
      if (!match.winner) {
        msg += `🎮 <@${match.p1}> vs <@${match.p2}>\n`;
      }
    });

    interaction.reply(msg);
  }
};


