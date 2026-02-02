const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/health', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Health server listening on port ${PORT}`);
});

// Start the bot
require('./index.js');
