const ItemClass = require('./item.js');
const { FreezingArea } = require('../ItemEvents/');

class FreezeBomb extends ItemClass {

  constructor(x, y) {
    super(x, y, 'FREEZE_BOMB');
  }

  beCollected(player) {
    super.beCollected(player);
    player.item = this.constructor;
  }

  // create a freezing area
  static use( player ) {
    player.item = null;
    const newItemEvents = new FreezingArea( player.x, player.y, player );
    return { itemEvents: [newItemEvents] };
  }

}

module.exports = FreezeBomb;
