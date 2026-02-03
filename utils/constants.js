// utils/constants.js
const path = require('path');

// Load environment variables
const CLIENT_ID = process.env.BOTUSERID;          // Discord Application ID
const DISCORD_TOKEN = process.env.DISCORDTOKEN;   // Discord Bot Token
const WEBSITE_REPO = process.env.GITHUBREPO;      // GitHub repo URL
const GITHUB_TOKEN = process.env.GITHUBTOKEN;     // GitHub PAT
const RENDER_URL = process.env.RENDERSERVICEURL;  // Render service URL

// Paths to JSON data
const DATA_PATHS = {
  PLAYERS: 'data/players.json',
  TOURNAMENTS: 'data/tournaments.json',
  ANNOUNCEMENTS: 'data/announcements.json',
  BRACKET: 'data/bracket.json',
  LEADERBOARD_WEEKLY: 'data/leaderboardweekly.json',
  LEADERBOARD_MONTHLY: 'data/leaderboardmonthly.json'
};

// Leaderboard types
const LEADERBOARD_TYPES = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly'
};

// Default Discord roles or IDs (placeholder values)
const DEFAULT_ROLES = {
  ADMIN: 'admin-role-id',
  MODERATOR: 'moderator-role-id'
};

// Other static settings
const BOT_SETTINGS = {
  PREFIX: '!',
  MAX_PLAYERS: 100
};

module.exports = {
  CLIENT_ID,
  DISCORD_TOKEN,
  WEBSITE_REPO,
  GITHUB_TOKEN,
  RENDER_URL,
  DATA_PATHS,
  LEADERBOARD_TYPES,
  DEFAULT_ROLES,
  BOT_SETTINGS
};
