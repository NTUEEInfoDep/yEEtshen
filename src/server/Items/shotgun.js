const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');
const Bullet = require('../bullet');

class Shotgun extends ItemClass {

  constructor(x, y) {
    super(x, y);
  }

  beCollected(player) {
    super.beCollected(player);
    player.item = this.constructor;
  }

  static use( player ) {
    player.item = null;
    const newBullets = [];
    const { id, x, y, direction } = player;
    for( let i = 0; i < Constants.ITEMS_PARAMETERS.SHOTGUN_BULLET_NUMBER; i++ ) {
      const newBullet = new Bullet( id, x, y + Math.random() * 120, direction + ( Math.random() - 0.5 ) / 1.5 )
      newBullets.push( newBullet );
    }
    return { bullets: newBullets };
  }

}

module.exports = Shotgun;
