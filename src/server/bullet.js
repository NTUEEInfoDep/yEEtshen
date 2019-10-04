const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir, parentName) {
    //super(shortid(), x + Math.cos(dir) * Constants.PLAYER_RADIUS / 2, y - Math.sin(dir) * Constants.PLAYER_RADIUS / 2, dir, Constants.BULLET_SPEED);
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.originX = x;
    this.originY = y;
    this.parentName = parentName;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    let overLength = Math.hypot(this.x - this.originX, this.y - this.originY) > Constants.BULLET_LENGTH;
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE || overLength;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
    };
  }
}

module.exports = Bullet;
