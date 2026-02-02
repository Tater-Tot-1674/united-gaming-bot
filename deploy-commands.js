// deploy-commands.js
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
require('dotenv').config();

const DISCORDTOKEN = process.env.DISCORDTOKEN;
const BOTUSERID = process.env.BOTUSERID;

if (!DISCORDTOKEN || !BOTUSERID) {
  console.error('❌ Missing DISCORDTOKEN or BOTUSERID in environment variables');
  process.exit(1);
}

// Load all commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data?.toJSON) {
      commands.push(command.data.toJSON());
    }
  }
} else {
  console.warn('⚠️ No commands folder found');
}

// Deploy commands to Discord
const rest = new REST({ version: '10' }).setToken(DISCORDTOKEN);

(async () => {
  try {
    console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

    await rest.put(
      Routes.applicationCommands(BOTUSERID),
      { body: commands }
    );

    console.log(`✅ Successfully registered ${commands.length} commands globally.`);
  } catch (error) {
    console.error(error);
  }
})();

