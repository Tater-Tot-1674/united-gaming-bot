// utils/syncToSite.js
const fs = require('fs');
const path = require('path');

function syncToSite(filename) {
  // In Render, this could just write the file to a public folder
  // Adjust if your site is in /public or served differently
  const srcPath = path.join(__dirname, '../data', filename);
  const destPath = path.join(__dirname, '../public/data', filename);

  if (!fs.existsSync(path.dirname(destPath))) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
  }

  fs.copyFileSync(srcPath, destPath);
  console.log(`[syncToSite] ${filename} synced to public folder`);
}

module.exports = { syncToSite };

