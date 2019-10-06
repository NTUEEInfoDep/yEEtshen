const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');
const ComputerPlayer = require('../computerplayer');
const allComputerID = Object.keys(ComputerPlayer);

class LightSword extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }
  beCollected(player) {
    super.beCollected(player);
    player.state.lightSword = Date.now();
    player.radius = Constants.PLAYER_STATE_PARAMETERS.LIGHTSWORD_RADIUS;
    if (!allComputerID.includes(player.id)) {
      player.speed = Constants.PLAYER_STATE_PARAMETERS.LIGHTSWORD_SPEED;
    }
  }
}

module.exports = LightSword;
