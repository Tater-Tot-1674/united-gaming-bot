// index.js
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Use BOT_TOKEN from Render environment variables
const token = process.env.BOT_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath, { withFileTypes: true }).forEach(dir => {
  if (dir.isDirectory()) {
    const commandFiles = fs.readdirSync(path.join(commandsPath, dir.name)).filter(f => f.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(path.join(commandsPath, dir.name, file));
      client.commands.set(command.data.name, command);
    }
  }
});

// Load events
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).filter(f => f.endsWith('.js')).forEach(file => {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
});

client.login(token);
