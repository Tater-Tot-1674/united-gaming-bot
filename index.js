const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const express = require('express');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const DISCORDTOKEN = process.env.DISCORDTOKEN;
const CLIENT_ID = process.env.BOTUSERID;

// Start a dummy server for Render
const app = express();
const PORT = 10000;
app.get('/', (req, res) => res.send('Bot is deployed!'));
app.listen(PORT, () => console.log(`🌐 Health server listening on port ${PORT}`));

// Log the bot in
console.log('🔑 Starting Discord bot...');
client.login(DISCORDTOKEN)
  .then(() => console.log(`✅ Bot logged in as ${client.user.tag}`))
  .catch(err => console.error('❌ Failed to log in:', err));

// Optional: deploy commands after login (you can comment this out for now)
client.once('ready', async () => {
  console.log('🚀 Ready! Bot is online.');


  try {
    const rest = new REST({ version: '10' }).setToken(DISCORDTOKEN);
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('🌍 Global slash commands deployed!');
  } catch (err) {
    console.error('❌ Failed to deploy commands:', err);
  }
});
