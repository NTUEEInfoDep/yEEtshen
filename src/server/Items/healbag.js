const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');
const ItemEvent = require( '../ItemEvents/');

class Healbag extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }

  beCollected(player) { 
    super.beCollected(player);
    // regain hp
    player.state.heal = Date.now();
    player.hp = Math.min(
      player.hp + Constants.ITEMS_PARAMETERS.HEALBAG_HEAL_HP,
      Constants.PLAYER_MAX_HP
    )
  }
}

module.exports = Healbag;
