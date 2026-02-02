// index.js
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config(); // in case you ever want a .env locally

// Read token from Render environment variable
const TOKEN = process.env.DISCORDTOKEN;

if (!TOKEN) {
    console.error('❌ DISCORDTOKEN not set in environment variables');
    process.exit(1);
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Event: ready
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}!`);
});

// Event: error
client.on('error', error => {
    console.error('❌ Discord client error:', error);
});

// Log in
console.log('🔑 Starting Discord bot...');
client.login(TOKEN);

