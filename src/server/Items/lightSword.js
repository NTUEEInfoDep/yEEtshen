const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');

class LightSword extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }
  beCollected(player) {
    super.beCollected(player);
    player.state.lightSword = Date.now();
    player.speed = Constants.PLAYER_STATE_PARAMETERS.LIGHTSWORD_SPEED;
    player.radius = Constants.PLAYER_STATE_PARAMETERS.LIGHTSWORD_RADIUS;
  }
}

module.exports = LightSword;
