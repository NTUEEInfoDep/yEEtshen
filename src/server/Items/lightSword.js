const ItemClass = require('./item.js');

class LightSword extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }
  beCollected(player) {
    super.beCollected(player);
    // generate lightSword itemEvent
  }
}

module.exports = LightSword;
