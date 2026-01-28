const ranks = ['Rookie', 'Bronze', 'Silver', 'Gold', 'Elite', 'Champion'];

function updateRank(players, playerId) {
  const player = players.find(p => p.id === playerId);
  if (!player) return;

  const wins = player.wins || 0;
  if (wins >= 25) player.rank = 'Champion';
  else if (wins >= 20) player.rank = 'Elite';
  else if (wins >= 15) player.rank = 'Gold';
  else if (wins >= 10) player.rank = 'Silver';
  else if (wins >= 5) player.rank = 'Bronze';
  else player.rank = 'Rookie';
}

module.exports = { updateRank };

