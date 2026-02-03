const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// Show token length so we know Render is reading it
console.log("Token length:", process.env.DISCORDTOKEN?.length);

// Create client with forced single shard
const client = new Client({
  shards: 1,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Debugging hooks to expose gateway behavior
client.on('debug', msg => console.log("[DEBUG]", msg));
client.on('warn', msg => console.log("[WARN]", msg));
client.on('error', err => console.log("[CLIENT ERROR]", err));
client.on('shardError', err => console.log("[SHARD ERROR]", err));

// Ready event
client.once('ready', () => {
  console.log(`READY FIRED: Logged in as ${client.user.tag}`);
});

// Attempt login
console.log("Attempting login...");
client.login(process.env.DISCORDTOKEN);

// Render health server
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send("Bot running"));
app.listen(PORT, () => console.log("Health server on port", PORT));

