// events/ready.js

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`🤖 Bot is fully online as ${client.user.tag}`);

    // Optional: set a status so you can visually confirm it's alive
    client.user.setPresence({
      activities: [
        { name: 'KartKings | /help', type: 0 } // 0 = Playing
      ],
      status: 'online'
    });

    console.log('✅ Presence set. Bot is ready to roll.');
  }
};
