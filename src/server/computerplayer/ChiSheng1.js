const ComputerPlayer = require('./computerplayer');

class ChiSheng1 extends ComputerPlayer {
  constructor(x, y) {
    super('ChiSheng1', '奇聖一號（電腦）', x, y);
    this.fireCooldown = 0.35;
  }
}

module.exports = ChiSheng1;