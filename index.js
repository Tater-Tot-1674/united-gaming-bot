// index.js
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Read Render env variables
const DISCORDTOKEN = process.env.DISCORDTOKEN;
const BOTUSERID = process.env.BOTUSERID;

// Check required env vars
if (!DISCORDTOKEN || !BOTUSERID) {
  console.error('❌ Missing required environment variables (DISCORDTOKEN or BOTUSERID)');
  process.exit(1);
}

// Create Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (('data' in command && 'execute' in command) || ('name' in command && 'execute' in command)) {
      client.commands.set(command.data?.name || command.name, command);
    } else {
      console.warn(`[WARNING] Command file ${file} missing "data" or "name" property`);
    }
  }
}

// Command interaction
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '❌ Error executing command.', ephemeral: true });
    } else {
      await interaction.reply({ content: '❌ Error executing command.', ephemeral: true });
    }
  }
});

// Login
client.login(DISCORDTOKEN)
  .then(() => console.log(`✅ Logged in as ${client.user.tag}`))
  .catch(err => {
    console.error('❌ Bot login failed:', err);
    process.exit(1);
  });

// Export client for server.js if needed
module.exports = client;

