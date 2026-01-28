const fs = require("fs");
const path = require("path");
const bracketGen = require("../../utils/bracketGen");

const tournamentsPath = path.join(__dirname, "../../data/tournaments.json");
const bracketPath = path.join(__dirname, "../../data/bracket.json");

module.exports = {
  name: "bracket",
  description: "Generate the tournament bracket",

  async execute(interaction) {
    let tournaments = JSON.parse(fs.readFileSync(tournamentsPath, "utf8"));

    const tournament = tournaments.find(t => t.active);

    if (!tournament)
      return interaction.reply({ content: "No active tournament found.", ephemeral: true });

    if (tournament.players.length < 2)
      return interaction.reply({ content: "Not enough players to start.", ephemeral: true });

    // 🔒 Lock tournament
    tournament.active = false;

    const bracket = bracketGen(tournament.players);

    fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));
    fs.writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));

    // 📋 Format round 1 matches
    let msg = "🏆 **TOURNAMENT BRACKET GENERATED**\n\n**Round 1 Matchups:**\n";

    bracket.rounds[0].forEach((match, i) => {
      msg += `Match ${i + 1}: <@${match.p1}> vs <@${match.p2}>\n`;
    });

    interaction.reply(msg);
  }
};


