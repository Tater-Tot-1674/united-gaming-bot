exports.rankSystem = {

  getRank(xp) {
    if (xp < 100) return "Rookie";
    if (xp < 250) return "Bronze";
    if (xp < 500) return "Silver";
    if (xp < 800) return "Gold";
    if (xp < 1200) return "Elite";
    return "Champion";
  },

  getProgress(xp) {
    const tiers = [
      { name: "Rookie", min: 0, max: 100 },
      { name: "Bronze", min: 100, max: 250 },
      { name: "Silver", min: 250, max: 500 },
      { name: "Gold", min: 500, max: 800 },
      { name: "Elite", min: 800, max: 1200 },
      { name: "Champion", min: 1200, max: Infinity }
    ];

    const tier = tiers.find(t => xp >= t.min && xp < t.max);
    if (!tier || tier.max === Infinity) return 100;

    return Math.floor(((xp - tier.min) / (tier.max - tier.min)) * 100);
  }

};

