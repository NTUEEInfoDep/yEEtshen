const ItemClass = require('./item.js');
const { BombExplosion } = require('../ItemEvents/');
const Constants =  require('../../shared/constants');
const { BOMB_EXPLOSIONS_NUMBER, BOMB_EXPLOSIONS_RADIUS } = Constants.ITEM_EVENTS_PARAMETERS;

class Bomb extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }
  beCollected(player) {
    super.beCollected(player);
    player.item = this.constructor;
  }
  static use( player ) {
    const newItemEvents = [];
    const { x, y, direction } = player;
    for ( let i=0; i< BOMB_EXPLOSIONS_NUMBER; i++ ) {
      const dir =  direction + 2*Math.PI/BOMB_EXPLOSIONS_NUMBER*i;
      newItemEvents.push( new BombExplosion( x + 2 * BOMB_EXPLOSIONS_RADIUS * Math.sin(dir) , y - 2 * BOMB_EXPLOSIONS_RADIUS * Math.cos(dir), player.id, player.username) );
    }
    newItemEvents.push( new BombExplosion( x, y, player.id, player.username ) );
    player.item = null;
    return { itemEvents: newItemEvents };
  }

}

module.exports = Bomb;
