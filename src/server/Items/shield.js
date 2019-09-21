const ItemClass = require('./item.js');

class Shield extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }
  beCollected(player) {
    super.beColected(player);
    //TODO: generate Shield itemEvent
  }
}

module.exports = Shield;
