const ItemClass = require('./item.js');

class Cannon extends ItemClass {
  constructor(x, y) {
    super(x, y, 'CANNON');
  }
  beCollected(player) {
    super.beCollected(player);
    player.item = this.constructor;
  }

}

module.exports = Cannon;
