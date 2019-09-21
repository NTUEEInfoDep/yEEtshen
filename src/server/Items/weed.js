const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class Weed extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }

  beCollected(player) { 
    super.beCollected(player);
    //TODO: change player's state
  }
}

module.exports = Weed;
