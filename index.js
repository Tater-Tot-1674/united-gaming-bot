const { Client, GatewayIntentBits } = require('discord.js');

console.log("Token length:", process.env.DISCORDTOKEN?.length);

const client = new Client({
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
