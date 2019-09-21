const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class Healbag extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }

  beCollected(player) { 
    super.beCollected(player);

    // regain hp
    player.hp = Math.min(
      player.hp + Constants.ITEMS_PARAMETERS.HEALBAG_HEAL_HP,
      Constants.PLAYER_MAX_HP
    )
  }
}

module.exports = Healbag;
