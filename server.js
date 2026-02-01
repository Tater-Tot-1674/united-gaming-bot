const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => res.send('Bot is alive!'));

app.listen(PORT, () => {
  console.log(`Health server listening on port ${PORT}`);
});
