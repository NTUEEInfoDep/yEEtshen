const ItemClass = require('./item.js');

class Shield extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }
  beCollected(player) {
    super.beCollected(player);
    player.state.shield = Date.now();
  }
}

module.exports = Shield;
