const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class LightSword extends ItemClass {
  constructor(x, y) {
    super(x, y, 'LIGHTSWORD');
  }

  use() {
    super.use();

    // this.ownedPlayer.hp = Math.min(
    //   this.ownedPlayer.hp + Constants.ITEMS_PARAMETERS.HEALBAG_HEAL_HP,
    //   Constants.PLAYER_MAX_HP
    //   );
  }

  update(dt) {
    super.update(dt);
  }
}

module.exports = LightSword;
