const announcementsContainer = document.getElementById('announcements');

async function fetchAnnouncements() {
  try {
    const res = await fetch('/data/announcements.json', { cache: 'no-store' });
    const data = await res.json();
    updateAnnouncements(data);
  } catch (err) {
    console.error('Failed to fetch announcements:', err);
  }
}

function updateAnnouncements(data) {
  announcementsContainer.innerHTML = '';
  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'announcement';
    div.innerHTML = `
      <h4>${item.title}</h4>
      <p>${item.content}</p>
      <small>${new Date(item.date).toLocaleString()}</small>
    `;
    announcementsContainer.appendChild(div);
  });
}

fetchAnnouncements();
setInterval(fetchAnnouncements, 5000);
