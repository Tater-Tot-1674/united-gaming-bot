const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function syncToSite(fileName) {
  try {
    const filePath = path.join(__dirname, `../data/${fileName}`);
    const fileData = fs.readFileSync(filePath, 'utf8');

    // This pushes data to your GitHub Pages repo
    await fetch(process.env.SITE_SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SITE_SYNC_TOKEN}`
      },
      body: JSON.stringify({
        file: fileName,
        content: fileData
      })
    });

    console.log(`Synced ${fileName} to site`);
  } catch (err) {
    console.error('Site sync failed:', err.message);
  }
}

module.exports = { syncToSite };

