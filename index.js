const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

console.log('Starting Discord bot...');

// Create client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Collection();

// Load commands dynamically
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
  const folderPath = path.join(commandsPath, folder);
  if (fs.lstatSync(folderPath).isDirectory()) {
    fs.readdirSync(folderPath).filter(file => file.endsWith('.js')).forEach(file => {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      if (command.data && command.execute) {
        client.commands.set(command.data.name || command.name, command);
      }
    });
  }
});

// Login
const token = process.env.DISCORDTOKEN;
if (!token) {
  console.error('No Discord token set in environment variables!');
  process.exit(1);
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: 'Error executing command', ephemeral: true });
  }
});

client.login(token);
