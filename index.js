// ===============================
// Imports
// ===============================
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const express = require('express');
const path = require('path');
const fs = require('fs');

// ===============================
// Environment Variables
// ===============================
const DISCORDTOKEN = process.env.DISCORDTOKEN;
const CLIENT_ID = process.env.BOTUSERID;

// ===============================
// Basic Validation
// ===============================
console.log("🔍 Checking environment variables...");

if (!DISCORDTOKEN) {
  console.error("❌ DISCORDTOKEN is missing! Add it in Render → Environment.");
}

if (!CLIENT_ID) {
  console.error("❌ BOTUSERID (Application ID) is missing! Add it in Render → Environment.");
}

// ===============================
// Discord Client
// ===============================
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ===============================
// Render Health Server
// ===============================
const app = express();
const PORT = 10000;

app.get('/', (req, res) => res.send('Bot is deployed and running.'));
app.listen(PORT, () => console.log(`🌐 Health server running on port ${PORT}`));

// ===============================
// Load Slash Commands (Optional)
// ===============================
let commands = [];

try {
  const commandsDir = path.join(__dirname, 'commands');

  function loadCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        loadCommands(fullPath);
      } else if (file.endsWith('.js')) {
        const cmd = require(fullPath);

        if (cmd.data) {
          commands.push(cmd.data.toJSON());
          console.log(`📦 Loaded slash command: ${cmd.data.name}`);
        } else {
          console.log(`⚠ Skipped non-slash command file: ${file}`);
        }
      }
    }
  }

  loadCommands(commandsDir);
} catch (err) {
  console.error("⚠ Command loading error:", err);
}

// ===============================
// Login to Discord
// ===============================
console.log("🔑 Attempting to log in to Discord...");

client.login(DISCORDTOKEN)
  .then(() => {
    console.log(`✅ Logged in as ${client.user.tag}`);
  })
  .catch(err => {
    console.error("❌ Discord login failed!");
    console.error(err);
  });

// ===============================
// Ready Event
// ===============================
client.once('ready', async () => {
  console.log("🚀 Bot is online and ready.");

  // Deploy slash commands if any exist
  if (commands.length > 0) {
    try {
      console.log("📡 Deploying slash commands...");

      const rest = new REST({ version: '10' }).setToken(DISCORDTOKEN);

      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );

      console.log("🌍 Slash commands deployed globally.");
    } catch (err) {
      console.error("❌ Failed to deploy slash commands:");
      console.error(err);
    }
  } else {
    console.log("ℹ No slash commands found. Skipping deployment.");
  }
});

