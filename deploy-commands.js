const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const DISCORD_TOKEN = process.env.DISCORDTOKEN;
const BOT_USER_ID = process.env.BOTUSERID;

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

fs.readdirSync(commandsPath).forEach(category => {
  const categoryPath = path.join(commandsPath, category);
  if (!fs.lstatSync(categoryPath).isDirectory()) return;

  fs.readdirSync(categoryPath).forEach(file => {
    if (!file.endsWith('.js')) return;
    const command = require(path.join(categoryPath, file));
    if (command.data) commands.push(command.data.toJSON());
  });
});

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} commands.`);
    await rest.put(
      Routes.applicationCommands(BOT_USER_ID),
      { body: commands }
    );
    console.log(`Successfully reloaded ${commands.length} commands.`);
  } catch (error) {
    console.error(error);
  }
})();
