const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class Weed extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }

  beCollected(player) { 
    super.beCollected(player);
    player.state.weed = Date.now();
  }
}

module.exports = Weed;
