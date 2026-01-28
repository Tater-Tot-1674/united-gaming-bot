module.exports = function bracketGen(players) {
  // Shuffle players
  players = players.sort(() => Math.random() - 0.5);

  const rounds = [];
  let currentRound = [];

  for (let i = 0; i < players.length; i += 2) {
    currentRound.push({
      p1: players[i],
      p2: players[i + 1] || null,
      winner: null
    });
  }

  rounds.push(currentRound);

  return {
    created: new Date().toISOString(),
    rounds
  };
};


