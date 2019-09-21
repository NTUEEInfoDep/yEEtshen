const shortid = require('shortid');
const ObjectClass = require('../object');
const Constants = require('../../shared/constants');

// The base class to be inherited by other item classes.
class ItemClass extends ObjectClass {
  constructor(x, y) {
    super(shortid(), x, y, 0, 0);
    this.radius = Constants.ITEM_RADIUS;
  }

  beCollected(player) {
    // maybe put some collected effect here
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      name: this.constructor.name
    };
  }
}

module.exports = ItemClass;
