const ComputerPlayer = require('./computerplayer');

class ChiSheng2 extends ComputerPlayer {
  constructor(x, y) {
    super('ChiSheng2', '奇聖二號（電腦）', x, y);
    this.fireCooldown = 0.1;
  }
}

module.exports = ChiSheng2;