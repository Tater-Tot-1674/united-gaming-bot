// ===============================
// Imports
// ===============================
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { DISCORD_TOKEN, CLIENT_ID } = require('./utils/constants');

// ===============================
// Environment Validation
// ===============================
console.log("🔍 Checking environment variables...");

if (!DISCORD_TOKEN) console.error("❌ DISCORDTOKEN is missing!");
if (!CLIENT_ID) console.error("❌ BOTUSERID is missing!");

// ===============================
// Discord Client
// ===============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Store slash + prefix commands
client.commands = new Collection();

// ===============================
// Load Commands
// ===============================
console.log("📦 Loading commands...");

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    // Register slash commands
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`✔ Slash command loaded: ${command.data.name}`);
    }

    // Register prefix commands
    if (command.prefix && command.execute) {
      client.commands.set(command.prefix, command);
      console.log(`✔ Prefix command loaded: !${command.prefix}`);
    }
  }
}

// ===============================
// Load Events
// ===============================
console.log("🎧 Loading events...");

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }

  console.log(`✔ Event loaded: ${event.name}`);
}

// ===============================
// Render Health Server
// ===============================
const app = express();
const PORT = 10000;

app.get('/', (req, res) => res.send('Bot is deployed and running.'));
app.listen(PORT, () => console.log(`🌐 Health server running on port ${PORT}`));

// ===============================
// Login
// ===============================
console.log("🔑 Logging into Discord...");

client.login(DISCORD_TOKEN)
  .then(() => console.log(`✅ Logged in as ${client.user.tag}`))
  .catch(err => {
    console.error("❌ Discord login failed!");
    console.error(err);
  });
