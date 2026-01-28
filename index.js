const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { syncToSite } = require('./utils/syncToSite');

const DISCORD_TOKEN = process.env.DISCORDTOKEN;
const BOT_USER_ID = process.env.BOTUSERID;
const GITHUB_TOKEN = process.env.GITHUBTOKEN;
const WEBSITE_REPO = process.env.GITHUBREPO;
const RENDER_URL = process.env.RENDERSERVICEURL; // optional

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(category => {
  const categoryPath = path.join(commandsPath, category);
  if (!fs.lstatSync(categoryPath).isDirectory()) return;

  fs.readdirSync(categoryPath).forEach(file => {
    if (!file.endsWith('.js')) return;
    const command = require(path.join(categoryPath, file));
    client.commands.set(command.data?.name || command.name, command);
  });
});

// Load events
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
  if (!file.endsWith('.js')) return;
  const event = require(path.join(eventsPath, file));
  if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
  else client.on(event.name, (...args) => event.execute(...args, client));
});

client.login(DISCORD_TOKEN);
