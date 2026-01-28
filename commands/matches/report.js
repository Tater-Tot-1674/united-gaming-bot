const fs = require("fs");
const path = require("path");
const { addWin } = require("../../utils/leaderboardCalc");

const bracketPath = path.join(__dirname, "../../data/bracket.json");

module.exports = {
  name: "report",
  description: "Report a match result",

  options: [
    {
      name: "winner",
      type: 6, // USER
      description: "Who won the match?",
      required: true
    }
  ],

  async execute(interaction) {
    const winnerId = interaction.options.getUser("winner").id;

    let bracket = JSON.parse(fs.readFileSync(bracketPath, "utf8"));
    const roundIndex = bracket.currentRound;
    const round = bracket.rounds[roundIndex];

    let matchFound = false;

    for (let i = 0; i < round.length; i++) {
      const match = round[i];

      if (match.winner) continue;

      if (match.p1 === winnerId || match.p2 === winnerId) {
        match.winner = winnerId;
        matchFound = true;

        // 📊 leaderboard update
        addWin(winnerId);

        // ➡️ Advance to next round
        const nextRound = bracket.rounds[roundIndex + 1];

        if (nextRound) {
          const slot = Math.floor(i / 2);
          if (i % 2 === 0) nextRound[slot].p1 = winnerId;
          else nextRound[slot].p2 = winnerId;
        }

        break;
      }
    }

    if (!matchFound)
      return interaction.reply({ content: "Match not found.", ephemeral: true });

    // ✅ Check if round finished
    const roundDone = round.every(m => m.winner);

    if (roundDone) {
      bracket.currentRound++;

      // 🏆 Tournament winner?
      if (bracket.currentRound >= bracket.rounds.length) {
        fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));
        return interaction.reply(`🏆 **TOURNAMENT CHAMPION:** <@${winnerId}>`);
      }
    }

    fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));

    interaction.reply("Result recorded. Bracket updated.");
  }
};



