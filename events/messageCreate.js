import { Client, Intents } from 'discord.js';
import fs from 'fs';
import path from 'path';

export default async function messageCreate(client) {
  client.on('messageCreate', async (message) => {
    // Ignore bots
    if (message.author.bot) return;

    // Prefix for commands
    const prefix = '!';

    if (!message.content.startsWith(prefix)) return;

    // Extract command and args
    const [cmdName, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/\s+/);

    // Dynamically load all commands from the commands folder
    const commandsPath = path.join(process.cwd(), 'commands');
    const commandFolders = fs.readdirSync(commandsPath);

    let commandFound = false;

    for (const folder of commandFolders) {
      const folderPath = path.join(commandsPath, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const commandFiles = fs
        .readdirSync(folderPath)
        .filter((file) => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = await import(`file://${filePath}`);

        if (command.default.name === cmdName.toLowerCase()) {
          try {
            await command.default.execute(message, args, client);
          } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command.');
          }
          commandFound = true;
          break;
        }
      }

      if (commandFound) break;
    }

    if (!commandFound) {
      message.reply(`Unknown command. Use ${prefix}help to see available commands.`);
    }
  });
}

