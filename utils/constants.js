// utils/constants.js
const path = require('path');

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

// Default Discord roles or IDs (example placeholders)
const DEFAULT_ROLES = {
  ADMIN: 'admin-role-id',
  MODERATOR: 'moderator-role-id'
};

// Any other static values
const BOT_SETTINGS = {
  PREFIX: '!',
  MAX_PLAYERS: 100
};

module.exports = {
  DATA_PATHS,
  LEADERBOARD_TYPES,
  DEFAULT_ROLES,
  BOT_SETTINGS
};
