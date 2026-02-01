// index.js
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Create a new Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collection for commands
client.commands = new Collection();

// Load command files dynamically
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = require(filePath);

    // Ensure command has required properties
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data?.name || command.name, command);
    } else {
      console.warn(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
    }
  }
}

// Event: bot ready
client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Event: interaction create
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ There was an error while executing this command.', ephemeral: true });
  }
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN);
