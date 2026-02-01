require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

// --- Health server ---
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/health', (req, res) => res.send('Bot is alive!'));
app.listen(PORT, () => console.log(`Health server listening on port ${PORT}`));

// --- Discord bot ---
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.once('ready', () => console.log(`Logged in as ${client.user.tag}`));
client.login(process.env.DISCORDTOKEN);
