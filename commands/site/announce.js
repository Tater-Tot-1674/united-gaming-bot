const fs = require('fs');
const path = require('path');
const { DATA_PATHS } = require('../../utils/constants');
const { syncToSite } = require('../../utils/syncToSite');

const announcementsPath = path.join(__dirname, '../../', DATA_PATHS.ANNOUNCEMENTS);

module.exports = {
  name: 'announce',
  description: 'Post an announcement to the site',
  async execute(interaction) {
    const content = interaction.options.getString('message');
    const user = interaction.user.username;

    const announcements = JSON.parse(fs.readFileSync(announcementsPath, 'utf8'));
    const newAnnouncement = {
      id: Date.now().toString(),
      author: user,
      content,
      date: new Date().toISOString()
    };
    announcements.push(newAnnouncement);

    fs.writeFileSync(announcementsPath, JSON.stringify(announcements, null, 2));
    syncToSite('announcements.json');

    return interaction.reply({ content: 'Announcement posted!', ephemeral: true });
  }
};
