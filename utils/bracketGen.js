function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function generateBracket(players) {
  const shuffled = shuffle([...players]);
  const bracket = [];

  for (let i = 0; i < shuffled.length; i += 2) {
    bracket.push({
      matchId: `match_${i / 2 + 1}`,
      player1: shuffled[i],
      player2: shuffled[i + 1] || null,
      winner: null
    });
  }

  return {
    created: new Date().toISOString(),
    rounds: [bracket]
  };
}

module.exports = { generateBracket };
