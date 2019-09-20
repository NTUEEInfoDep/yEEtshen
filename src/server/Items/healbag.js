const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class HealBag extends ItemClass {
  constructor(x, y) {
    super(x, y, 'HEALBAG');
  }

  use() {
    super.use();

    this.ownedPlayer.hp = Math.min(
      this.ownedPlayer.hp + Constants.ITEMS_PARAMETERS.HEALBAG_HEAL_HP,
      Constants.PLAYER_MAX_HP,
    );
  }
}

module.exports = HealBag;
