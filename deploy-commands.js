// deploy-commands.js
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { CLIENT_ID, DISCORD_TOKEN } = require('./utils/constants');

// Safety check
if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error('❌ Missing DISCORDTOKEN or BOTUSERID in environment variables.');
  process.exit(1);
}

// Load slash commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    // Only slash commands have "data"
    if (command.data && command.execute) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log(`🚀 Deploying ${commands.length} slash commands...`);

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );

    console.log(`✅ Successfully deployed ${commands.length} commands.`);
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
  }
})();
