const ItemClass = require('./item.js');
const { CannonExplosion } = require('../ItemEvents/')

class Cannon extends ItemClass {
  constructor(x, y) {
    super(x, y, 'CANNON');
  }
  beCollected(player) {
    super.beCollected(player);
    player.item = this.constructor;
  }
  static use( player ) {
    player.item = null;
    const newCannonExplosion = new CannonExplosion(player.x, player.y, player, player.direction);
    return { itemEvents: [newCannonExplosion] }
  }
}

module.exports = Cannon;
