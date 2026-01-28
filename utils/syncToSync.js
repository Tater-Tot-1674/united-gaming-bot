const fs = require('fs');
const path = require('path');

// Paths
const botDataPath = path.join(__dirname, '../data');
const siteDataPath = path.join(__dirname, '../../kartkings-site/data'); // adjust if repo structure differs

function syncToSite(filename) {
  try {
    const source = path.join(botDataPath, filename);
    const dest = path.join(siteDataPath, filename);
    fs.copyFileSync(source, dest);
    console.log(`Synced ${filename} to website.`);
  } catch (err) {
    console.error(`Failed to sync ${filename}:`, err);
  }
}

module.exports = { syncToSite };

