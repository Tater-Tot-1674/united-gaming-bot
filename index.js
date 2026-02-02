// index.js
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
require('dotenv').config();
const express = require('express');

// ----- CONFIG -----
const TOKEN = process.env.DISCORDTOKEN;
const CLIENT_ID = process.env.BOTUSERID; // bot application ID
const GUILD_ID = process.env.GUILDID; // optional: use for guild-specific commands

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error('❌ Make sure DISCORDTOKEN, BOTUSERID, and GUILDID are set!');
    process.exit(1);
}

// Example commands array
const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    {
        name: 'hello',
        description: 'Greets the user'
    }
];

// ----- DEPLOY SLASH COMMANDS -----
async function deployCommands() {
    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log('🚀 Deploying slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );
        console.log('✅ Slash commands deployed!');
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
}

// ----- CREATE BOT CLIENT -----
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

// Optional: handle command interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'ping') {
        await interaction.reply('Pong!');
    } else if (commandName === 'hello') {
        await interaction.reply(`Hello, ${interaction.user.username}!`);
    }
});

// ----- START BOT -----
(async () => {
    console.log('🔑 Starting Discord bot...');
    await deployCommands();
    await client.login(TOKEN);
})();

// ----- UNUSED PORT FOR RENDER -----
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`🌐 Health server listening on port ${PORT}`));

