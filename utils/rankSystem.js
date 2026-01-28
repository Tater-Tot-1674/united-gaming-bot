function getRankFromXP(xp) {
  if (xp >= 1000) return 'Diamond';
  if (xp >= 700) return 'Platinum';
  if (xp >= 500) return 'Gold';
  if (xp >= 300) return 'Silver';
  if (xp >= 100) return 'Bronze';
  return 'Rookie';
}

function updateRank(players, discordId) {
  const player = players.find(p => p.discordId === discordId);
  if (!player) return;

  player.rank = getRankFromXP(player.xp);
}

module.exports = { updateRank };
