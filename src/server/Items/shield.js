const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class Shield extends ItemClass {
  constructor(x, y) {
    super(x, y, 'SHIELD');
  }

  use() {
    super.use();
    this.special = {
      shouldUpdate: true, // Whether to create a new sprite in the client side
      used: true
    };

    this.lastTime = Constants.ITEMS_PARAMETERS.SHIELD_LAST_TIME;
  }

  update(dt) {
    super.update(dt);

    this.lastTime -= dt;
    // If the lastTime of Shield less than zero, it must be destroyed.
    // Otherwise it cannot be destroyed.
    this.destroy = (this.lastTime < 0);
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      special: this.special
    };
  }
}

module.exports = Shield;
