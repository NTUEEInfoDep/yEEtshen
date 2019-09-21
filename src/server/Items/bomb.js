const ItemClass = require('./item.js');
const { BombExplosion } = require('../ItemEvents/')

class Bomb extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }
  beCollected(player) {
    super.beCollected(player);
    player.item = this.constructor;
  }
  static use( player ) {
    const newItemEvent = new BombExplosion( player.x, player.y, player );
    return { itemEvents: [ newItemEvent ] };
  }

}

module.exports = Bomb;
