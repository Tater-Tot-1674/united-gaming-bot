import { Client, GatewayIntentBits, Collection } from 'discord.js';
import fs from 'fs';
import path from 'path';

// ===== Load env variables directly from Render =====
// Make sure on Render you add these in the Environment tab
const TOKEN = process.env.DISCORD_BOT_TOKEN;       // Discord bot token
const GUILD_ID = process.env.DISCORD_GUILD_ID;     // Optional: for guild-specific commands
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;    // For syncing to the website repo

if (!TOKEN) throw new Error('DISCORD_BOT_TOKEN is not set!');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.commands = new Collection();

// ===== Load commands dynamically =====
const commandsPath = path.join(process.cwd(), 'commands');
function loadCommands(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(file => {
    if (file.isDirectory()) {
      loadCommands(path.join(dir, file.name));
    } else if (file.name.endsWith('.js')) {
      import(path.join(dir, file.name)).then(cmd => {
        if (cmd.default && cmd.default.data?.name) {
          client.commands.set(cmd.default.data.name, cmd.default);
        }
      });
    }
  });
}
loadCommands(commandsPath);

// ===== Event Handlers =====
const eventsPath = path.join(process.cwd(), 'events');
fs.readdirSync(eventsPath).forEach(file => {
  if (file.endsWith('.js')) {
    import(path.join(eventsPath, file)).then(eventModule => {
      const eventName = file.split('.')[0];
      const handler = eventModule.default;
      if (handler) {
        client.on(eventName, handler.bind(null, client));
      }
    });
  }
});

// ===== Login =====
client.login(TOKEN).then(() => {
  console.log('Bot started with token from Render environment variables!');
});



client.login(process.env.TOKEN);


