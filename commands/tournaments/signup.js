const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "../../data/players.json");
const tournamentsPath = path.join(__dirname, "../../data/tournaments.json");

module.exports = {
  name: "signup",
  description: "Sign up for the active tournament",

  async execute(interaction) {
    const user = interaction.user;

    let players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
    let tournaments = JSON.parse(fs.readFileSync(tournamentsPath, "utf8"));

    if (!players[user.id]) {
      return interaction.reply({
        content: "You must register first using /register.",
        ephemeral: true
      });
    }

    // 🏁 Find active tournament or create one
    let tournament = tournaments.find(t => t.active);

    if (!tournament) {
      tournament = {
        id: Date.now(),
        name: "Weekly KartKings Cup",
        players: [],
        active: true,
        created: new Date().toISOString()
      };
      tournaments.push(tournament);
    }

    // ❌ Prevent double signup
    if (tournament.players.includes(user.id)) {
      return interaction.reply({
        content: "You are already signed up for this tournament.",
        ephemeral: true
      });
    }

    tournament.players.push(user.id);

    fs.writeFileSync(tournamentsPath, JSON.stringify(tournaments, null, 2));

    interaction.reply(
      `🎮 **${user.username}** has entered the **${tournament.name}**!\nTotal players: ${tournament.players.length}`
    );
  }
};



