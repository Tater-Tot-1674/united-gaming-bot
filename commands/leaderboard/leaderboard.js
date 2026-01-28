const leaderboardContainer = document.getElementById('leaderboard');

async function fetchLeaderboard() {
  try {
    const res = await fetch('/data/leaderboard_weekly.json', { cache: 'no-store' });
    const data = await res.json();
    updateLeaderboard(data);
  } catch (err) {
    console.error('Failed to fetch leaderboard:', err);
  }
}

function updateLeaderboard(data) {
  leaderboardContainer.innerHTML = ''; // clear old
  data.forEach(player => {
    const div = document.createElement('div');
    div.className = 'player-row';
    div.innerHTML = `
      <span class="rank">${player.rank}</span>
      <span class="name">${player.name}</span>
      <span class="points">${player.points}</span>
    `;
    leaderboardContainer.appendChild(div);
  });
}

// Initial load
fetchLeaderboard();

// Poll every 5s
setInterval(fetchLeaderboard, 5000);
