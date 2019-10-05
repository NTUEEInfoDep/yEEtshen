const shortid = require('shortid');
const ObjectClass = require('../object');

// The base class to be inherited by other item classes.
class ItemEventClass extends ObjectClass {
  constructor(x, y, radius, parentID, parentName, dir = 0 ) {
    super(shortid(), x, y, dir, 0);
    this.radius = radius;
    this.timestamp = Date.now();
    this.destroy = false;
    this.parentID = parentID;
    this.parentName = parentName;
  }

  // TODO:
  // update( dt, itemEvents )
  // collide( players ) 

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      name: this.constructor.name,
      timestamp: this.timestamp,
    };
  }
}

module.exports = ItemEventClass;
