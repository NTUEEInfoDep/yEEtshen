const ObjectClass = require('../object');
const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class Bomb extends ItemClass {
  constructor(x, y) {
    super(x, y, 'BOMB');
  }

  use() {
    super.use();

    this.special = {
      shouldUpdate: true, // Whether to create a new sprite in the client side
      used: true
    };

    this.radius = Constants.ITEMS_PARAMETERS.BOMB_EXPLODE_RADIUS;
    // only for rendering
    this.lastTime = Constants.ITEMS_PARAMETERS.BOMB_EXPLODE_LAST_TIME;

    const itemEvent = new ObjectClass(this.id, this.x, this.y, 0, 0);
    itemEvent.event = 'bomb_explode';
    itemEvent.parentID = this.ownedPlayer.id;

    return itemEvent;
  }

  update(dt) {
    super.update(dt);

    this.lastTime -= dt;
    // If the lastTime of Shield less than zero, it must be destroyed.
    // Otherwise it cannot be destroyed.
    this.destroy = (this.lastTime < 0);
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      special: this.special
    };
  }
}

module.exports = Bomb;
