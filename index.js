require("dotenv").config();

const fs = require("fs");
const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();


// ✅ LOAD COMMANDS FROM SUBFOLDERS
const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}


client.once("ready", () => {
  console.log(`🤖 Bot online as ${client.user.tag}`);
});


client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "❌ Error running command.",
      ephemeral: true
    });
  }
});


client.login(process.env.TOKEN);


