const fs = require('fs');
const path = require('path');

const botDataPath = path.join(__dirname, '../data');
const siteDataPath = path.join(__dirname, '../../kartkings-site/data');

function syncFromSite(filename) {
  try {
    const source = path.join(siteDataPath, filename);
    const dest = path.join(botDataPath, filename);
    fs.copyFileSync(source, dest);
    console.log(`Pulled ${filename} from website.`);
  } catch (err) {
    console.error(`Failed to pull ${filename}:`, err);
  }
}

module.exports = { syncFromSite };


