// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// ---------- Discord Bot Setup ----------
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const DISCORD_TOKEN = process.env.DISCORDTOKEN;

if (!DISCORD_TOKEN) {
    console.error('Error: DISCORDTOKEN environment variable is not set.');
    process.exit(1);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Example command handling (expand as needed)
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        await message.reply('Pong!');
    }
});

// Login
console.log('Starting Discord bot...');
client.login(DISCORD_TOKEN).catch((err) => {
    console.error('Failed to login to Discord:', err);
    process.exit(1);
});

// ---------- Health Check Server ----------
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Health server listening on port ${PORT}`);
});

