const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const DISCORDTOKEN = process.env.DISCORDTOKEN;
const CLIENT_ID = process.env.BOTUSERID;

// Start a dummy server for Render
const app = express();
const PORT = 10000;
app.get('/', (req, res) => res.send('Bot is deployed!'));
app.listen(PORT, () => console.log(`🌐 Health server listening on port ${PORT}`));

// Load slash commands from ./commands folder
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

// Log the bot in
console.log('🔑 Starting Discord bot...');
client.login(DISCORDTOKEN)
  .then(() => console.log(`✅ Bot logged in as ${client.user.tag}`))
  .catch(err => console.error('❌ Failed to log in:', err));

// Deploy commands after login
client.once('ready', async () => {
  console.log('🚀 Ready! Bot is online.');

  try {
    const rest = new REST({ version: '10' }).setToken(DISCORDTOKEN);

    console.log('📡 Deploying global slash commands...');
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log('🌍 Global slash commands deployed!');
  } catch (err) {
    console.error('❌ Failed to deploy commands:', err);
  }
});
