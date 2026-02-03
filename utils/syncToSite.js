// utils/syncToSite.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { WEBSITE_REPO, GITHUB_TOKEN } = require('./constants');

// Extract owner + repo from full URL
function parseRepo(url) {
  const parts = url.replace('https://github.com/', '').split('/');
  return { owner: parts[0], repo: parts[1] };
}

async function syncToSite(filename, repoOverride, tokenOverride) {
  const repoURL = repoOverride || WEBSITE_REPO;
  const token = tokenOverride || GITHUB_TOKEN;

  if (!repoURL || !token) {
    console.error('❌ Missing WEBSITE_REPO or GITHUB_TOKEN in environment.');
    return;
  }

  const { owner, repo } = parseRepo(repoURL);

  const filePath = path.join(__dirname, '../data', filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const encodedContent = Buffer.from(fileContent).toString('base64');

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/data/${filename}`;

  try {
    // Check if file exists (GET)
    let sha = null;
    try {
      const getRes = await axios.get(apiBase, {
        headers: { Authorization: `token ${token}` }
      });
      sha = getRes.data.sha;
    } catch {
      // File does not exist — GitHub will create it
    }

    // Commit file (PUT)
    await axios.put(
      apiBase,
      {
        message: `Update ${filename} via bot`,
        content: encodedContent,
        sha: sha || undefined
      },
      {
        headers: { Authorization: `token ${token}` }
      }
    );

    console.log(`📤 Synced ${filename} to website repo.`);
  } catch (err) {
    console.error(`❌ Failed to sync ${filename}:`, err.response?.data || err.message);
  }
}

module.exports = { syncToSite };


