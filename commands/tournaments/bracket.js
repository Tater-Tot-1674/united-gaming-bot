const bracketContainer = document.getElementById('bracket');

async function fetchBracket() {
  try {
    const res = await fetch('/data/bracket.json', { cache: 'no-store' });
    const data = await res.json();
    updateBracket(data);
  } catch (err) {
    console.error('Failed to fetch bracket:', err);
  }
}

function updateBracket(data) {
  bracketContainer.innerHTML = ''; // clear old
  data.matches.forEach(match => {
    const div = document.createElement('div');
    div.className = 'match-row';
    div.innerHTML = `
      <span class="player1">${match.player1}</span>
      <span class="vs">vs</span>
      <span class="player2">${match.player2}</span>
      <span class="score">${match.score1} - ${match.score2}</span>
    `;
    bracketContainer.appendChild(div);
  });
}

// Initial load
fetchBracket();
setInterval(fetchBracket, 5000);


