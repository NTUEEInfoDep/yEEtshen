const shortid = require('shortid');
const ObjectClass = require('../object');
const Constants = require('../../shared/constants');

// The base class to be inherited by other item classes.
class ItemClass extends ObjectClass {
  constructor(x, y, name = "ITEM") {
    super(shortid(), x, y, 0, 0);
    this.ownedPlayer = null;
    this.name = name; // For retreive ITEM_IMAGES
    this.used = false; // Whether this item has been used
    this.destroy = false; // Whether this item should be destroyed

    // Sepecial parameters for rendering. Ex: Used but has not been destroyed.
    this.special = null;
  }

  beGotBy(player) {
    this.ownedPlayer = player;
    player.item = this;
    // let the item move along with the player
    this.synceWith(player);
  }

  synceWith(player) {
    this.x = player.x;
    this.y = player.y;
    this.speed = player.speed;
    this.direction = player.direction;
  }

  use() {
    this.used = true;
    // console.log("Item be used!!");
  }

  update(dt) {
    super.update(dt);

    // For normal item, if it has been used, it has to be destroyed.
    this.destroy = this.used;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      name: this.name,
      special: this.special
    };
  }
}

module.exports = ItemClass;
