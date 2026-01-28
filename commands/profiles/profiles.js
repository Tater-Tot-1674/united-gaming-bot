const profileContainer = document.getElementById('profiles');

async function fetchProfiles() {
  try {
    const res = await fetch('/data/players.json', { cache: 'no-store' });
    const data = await res.json();
    updateProfiles(data);
  } catch (err) {
    console.error('Failed to fetch profiles:', err);
  }
}

function updateProfiles(data) {
  profileContainer.innerHTML = '';
  data.forEach(player => {
    const div = document.createElement('div');
    div.className = 'profile-card';
    div.innerHTML = `
      <h3>${player.name}</h3>
      <p>Rank: ${player.rank}</p>
      <p>XP: ${player.xp}</p>
      <p>Team: ${player.team}</p>
    `;
    profileContainer.appendChild(div);
  });
}

// Initial load
fetchProfiles();
// Poll every 5s
setInterval(fetchProfiles, 5000);


