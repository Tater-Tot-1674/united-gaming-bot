const fs = require('fs');
const path = require('path');
const { DATA_PATHS, WEBSITE_REPO, GITHUB_TOKEN } = require('../../utils/constants');
const { syncToSite } = require('../../utils/syncToSite');

const announcementsPath = path.join(__dirname, '../../', DATA_PATHS.ANNOUNCEMENTS);

module.exports = {
  name: 'announce',
  description: 'Post an announcement to the site',

  async execute(interaction) {
    const content = interaction.options.getString('message');
    const user = interaction.user.username;

    let announcements;
    try {
      announcements = JSON.parse(fs.readFileSync(announcementsPath, 'utf8'));
    } catch (err) {
      console.error('❌ Failed to read announcements.json:', err);
      return interaction.reply({ content: 'Error reading announcements.', ephemeral: true });
    }

    const newAnnouncement = {
      id: Date.now().toString(),
      author: user,
      content,
      date: new Date().toISOString()
    };

    announcements.push(newAnnouncement);

    try {
      fs.writeFileSync(announcementsPath, JSON.stringify(announcements, null, 2));
      syncToSite('announcements.json', WEBSITE_REPO, GITHUB_TOKEN);
    } catch (err) {
      console.error('❌ Failed to write announcements.json:', err);
    }

    return interaction.reply({ content: 'Announcement posted!', ephemeral: true });
  }
};

