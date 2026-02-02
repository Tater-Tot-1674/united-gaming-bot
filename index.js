// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// ======== Health server ========
const app = express();
const PORT = 10000;

app.get('/', (req, res) => {
    res.send('Health check OK');
});

app.listen(PORT, () => {
    console.log(`Health server listening on port ${PORT}`);
});

// ======== Discord bot ========
const token = process.env.DISCORDTOKEN;

if (!token) {
    console.error('DISCORDTOKEN environment variable not set!');
    process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('error', console.error);

client.login(token).catch(console.error);
