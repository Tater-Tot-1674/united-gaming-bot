// General constants for KartKings bot

export const RANKS = ['Rookie', 'Bronze', 'Silver', 'Gold', 'Elite', 'Champion'];

export const TEAM_COLORS = {
  red: '#f87171',
  blue: '#60a5fa',
  green: '#34d399',
  yellow: '#facc15',
  purple: '#a78bfa',
  orange: '#fb923c'
};

export const MAX_PARTICIPANTS = 16; // default max for tournaments

export const XP_PER_WIN = 100;
export const XP_PER_LOSS = 20;

export const MATCH_STAT_KEYS = ['kills', 'deaths', 'assists', 'flagsCaptured'];

export const TOURNAMENT_STATUS = {
  REGISTRATION: 'registration',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

// For syncing to the website repo
export const SITE_REPO_PATH = '../kartkings-site/data/';

export const ANNOUNCEMENT_TYPES = {
  GENERAL: 'general',
  EVENT: 'event',
  UPDATE: 'update'
};

