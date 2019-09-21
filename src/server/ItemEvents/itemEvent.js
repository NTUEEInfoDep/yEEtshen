const shortid = require('shortid');
const ObjectClass = require('../object');

// The base class to be inherited by other item classes.
class ItemEventClass extends ObjectClass {
  constructor(x, y, radius, owner ) {
    super(shortid(), x, y, 0, 0);
    this.radius = radius;
    this.timestamp = Date.now();
    this.needCollision = true;
    this.destroy = false;
    this.owner = owner;
  }

  // TODO:
  // update( dt )
  // collide( players ) 

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      name: this.constructor.name
    };
  }
}

module.exports = ItemEventClass;
