// deploy-commands.js
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load environment variables
const TOKEN = process.env.DISCORDTOKEN;
const CLIENT_ID = process.env.BOTUSERID;

if (!TOKEN || !CLIENT_ID) {
    console.error('❌ DISCORDTOKEN or BOTUSERID not set in environment variables');
    process.exit(1);
}

// Load all command files from ./commands
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`⚠️ Command at ${filePath} missing required "data" or "execute" property.`);
        }
    }
}

// Deploy commands using REST
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Successfully reloaded ${commands.length} application (/) commands.`);
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
