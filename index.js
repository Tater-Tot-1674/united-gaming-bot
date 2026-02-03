// index.js

const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// -------------------------------------
// Environment Variable Check
// -------------------------------------
console.log("🔍 Checking environment variables...");

if (!process.env.DISCORDTOKEN) {
  console.error("❌ Missing DISCORDTOKEN in environment variables.");
  process.exit(1);
}

// -------------------------------------
// Discord Client Setup
// -------------------------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// -------------------------------------
// Load Slash Commands
// -------------------------------------
console.log("📦 Loading commands...");

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log(`✔ Slash command loaded: ${command.data.name}`);
    }
  }
}

// -------------------------------------
// Load Events
// -------------------------------------
console.log("🎧 Loading events...");

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }

  console.log(`✔ Event loaded: ${event.name}`);
}

// -------------------------------------
// Login to Discord
// -------------------------------------
console.log("🔑 Logging into Discord...");

client.login(process.env.DISCORDTOKEN);

// -------------------------------------
// Health Server for Render
// -------------------------------------
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send("Bot is running.");
});

app.listen(PORT, () => {
  console.log(`🌐 Health server running on port ${PORT}`);
});
