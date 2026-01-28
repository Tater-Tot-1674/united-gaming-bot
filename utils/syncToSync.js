const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const GITHUB_TOKEN = process.env.GITHUBTOKEN;
const GITHUB_REPO = process.env.GITHUBREPO; // format: username/repo
const GITHUB_BRANCH = 'main';

async function syncToSite(fileName) {
  try {
    const filePath = path.join(__dirname, '../data', fileName);
    const content = fs.readFileSync(filePath, 'utf8');
    const encoded = Buffer.from(content).toString('base64');

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/${fileName}`;

    // Get current file SHA
    const res = await fetch(url, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });

    const data = await res.json();
    const sha = data.sha;

    // Update file
    await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Update ${fileName}`,
        content: encoded,
        sha,
        branch: GITHUB_BRANCH
      })
    });

    console.log(`Synced ${fileName} to site`);
  } catch (err) {
    console.error('Sync failed:', err);
  }
}

module.exports = { syncToSite };
