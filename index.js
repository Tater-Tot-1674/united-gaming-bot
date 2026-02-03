const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

console.log("Token length:", process.env.DISCORDTOKEN?.length);

const client = new Client({
  shards: 1,   // 🔥 Force single-shard mode (important for Render)
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`READY FIRED: Logged in as ${client.user.tag}`);
});

client.on('error', err => {
  console.error("Client error:", err);
});

client.on('shardError', err => {
  console.error("Shard error:", err);
});

console.log("Attempting login...");
client.login(process.env.DISCORDTOKEN);

// REQUIRED FOR RENDER
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => res.send("Bot running"));
app.listen(PORT, () => console.log("Health server on port", PORT));
