const DISCORD_TOKEN = process.env.DISCORDTOKEN;
const GITHUB_TOKEN = process.env.GITHUBTOKEN;
const WEBSITE_REPO = process.env.GITHUBREPO;
const BOT_USER_ID = process.env.BOTUSERID;
const RENDER_URL = process.env.RENDERSERVICEURL; // optional

const fs = require('fs');
const path = require('path');
const { generateBracket } = require('../../utils/bracketGen');
const { syncToSite } = require('../../utils/syncToSite');

const tournamentsPath = path.join(__dirname, '../../data/tournaments.json');
const bracketPath = path.join(__dirname, '../../data/bracket.json');

module.exports = {
  name: 'bracket',
  description: 'Generate tournament bracket',
  async execute(interaction) {
    const tournamentId = interaction.options.getString('tournament_id');

    const tournaments = JSON.parse(fs.readFileSync(tournamentsPath));
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) return interaction.reply({ content: 'Tournament not found', ephemeral: true });

    const bracket = generateBracket(tournament.participants || []);
    fs.writeFileSync(bracketPath, JSON.stringify(bracket, null, 2));
    syncToSite('bracket.json'); // 🔥 live update

    return interaction.reply({ content: `Bracket for ${tournament.name} generated!`, ephemeral: true });
  }
};


