// index.js
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Load environment variables from Render
const TOKEN = process.env.DISCORDTOKEN;
const PORT = process.env.PORT || 10000;

// --------- Discord Bot Setup ---------
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent // required if you want to read message content
    ]
});

// Log when the bot is ready
client.once('ready', () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

// Catch login errors
client.login(TOKEN)
    .then(() => console.log('Discord login attempt made'))
    .catch(err => {
        console.error('❌ Bot login failed:', err);
        process.exit(1); // exit if login fails
    });

// --------- Express Health Server ---------
const app = express();

// Simple health check
app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Health server listening on port ${PORT}`);
});
