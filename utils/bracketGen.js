module.exports = function generateBracket(players) {
  players = players.sort(() => Math.random() - 0.5);

  const rounds = [];

  // ROUND 1
  let round = [];
  for (let i = 0; i < players.length; i += 2) {
    round.push({
      p1: players[i],
      p2: players[i + 1] || null,
      winner: null
    });
  }

  rounds.push(round);

  // Future empty rounds placeholder
  let size = round.length;
  while (size > 1) {
    size = Math.ceil(size / 2);
    rounds.push(Array(size).fill({ p1: null, p2: null, winner: null }));
  }

  return {
    created: new Date().toISOString(),
    currentRound: 0,
    rounds
  };
};


