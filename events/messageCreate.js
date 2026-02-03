// events/messageCreate.js
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'messageCreate',

  async execute(message, client) {
    // Ignore bot messages
    if (message.author.bot) return;

    const prefix = '!';

    // Only handle prefix commands
    if (!message.content.startsWith(prefix)) return;

    // Extract command name + args
    const [cmdName, ...args] = message.content
      .slice(prefix.length)
      .trim()
      .split(/\s+/);

    const commandsPath = path.join(__dirname, '../commands');
    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {
      const folderPath = path.join(commandsPath, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

      for (const file of files) {
        const filePath = path.join(folderPath, file);

        let command;
        try {
          command = require(filePath);
        } catch (err) {
          console.error(`❌ Failed to load prefix command file: ${file}`, err);
          continue;
        }

        // Only run commands that explicitly support prefix mode
        if (command.prefix && command.prefix.toLowerCase() === cmdName.toLowerCase()) {
          try {
            await command.execute(message, args, client);
          } catch (err) {
            console.error('❌ Prefix command execution error:', err);
            message.reply('There was an error executing that command.');
          }
          return;
        }
      }
    }

    // If no prefix command matched
    message.reply(`Unknown command. Use ${prefix}help to see available commands.`);
  }
};
