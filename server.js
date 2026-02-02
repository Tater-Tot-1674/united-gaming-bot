// server.js
const express = require('express');
const path = require('path');
require('dotenv').config();

const DISCORDTOKEN = process.env.DISCORDTOKEN;
const BOTUSERID = process.env.BOTUSERID;
const GITHUBREPO = process.env.GITHUBREPO;
const GITHUBTOKEN = process.env.GITHUBTOKEN;
const RENDERSERVICEURL = process.env.RENDERSERVICEURL;

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files (website)
app.use(express.static(path.join(__dirname, 'public')));

// Health endpoint
app.get('/health', (req, res) => {
  res.send('🟢 OK');
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Health server listening on port ${PORT}`);
});

// Start Discord bot
console.log('Starting Discord bot...');
require('./index'); // imports index.js and logs in bot
