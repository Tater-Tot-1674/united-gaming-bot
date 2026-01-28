import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import { syncToSite } from '../../utils/syncToSite.js';

export default {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Post an announcement to the website and optionally ping players')
    .addStringOption(option =>
      option.setName('title').setDescription('Announcement title').setRequired(true))
    .addStringOption(option =>
      option.setName('message').setDescription('Announcement message').setRequired(true)),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');

    const filePath = './data/announcements.json';
    const announcements = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const newAnnouncement = {
      id: Date.now(),
      title,
      message,
      date: new Date().toISOString()
    };

    announcements.push(newAnnouncement);
    fs.writeFileSync(filePath, JSON.stringify(announcements, null, 2));

    await syncToSite('announcements.json'); // update website

    await interaction.reply({ content: `Announcement posted: **${title}** ✅`, ephemeral: true });
  }
};

