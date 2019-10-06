const ItemClass = require('./item.js');
const Constants = require('../../shared/constants');
const ItemEvent = require( '../ItemEvents/');

const ComputerPlayer = require('../computerplayer');
const allComputerID = Object.keys(ComputerPlayer);

class Healbag extends ItemClass {
  constructor(x, y) {
    super(x, y);
  }

  beCollected(player) { 
    super.beCollected(player);
    // regain hp
    player.state.heal = Date.now();
    if (allComputerID.includes(player.id)) {
      player.hp = Math.min(
      player.hp + Constants.ITEMS_PARAMETERS.HEALBAG_HEAL_HP,
      Constants.COMPUTER_PLAYER_MAX_HP);
    } else {
      player.hp = Math.min(
        player.hp + Constants.ITEMS_PARAMETERS.HEALBAG_HEAL_HP,
        Constants.PLAYER_MAX_HP);
    }
  }
}

module.exports = Healbag;
