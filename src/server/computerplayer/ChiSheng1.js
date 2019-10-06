const ComputerPlayer = require('./computerplayer');
const Bullet = require('../bullet');

class ChiSheng1 extends ComputerPlayer {
  constructor(x, y) {
    super('ChiSheng1', '奇聖一號（電腦）', x, y);
    this.fireCooldown = 0.35;
  }

  move() {
    const randomAngle = (Math.random() * 10) - 5;
    this.rotateSpeed = Math.round(randomAngle) * Math.PI / 180;
  }

  shot() {
    const bulletArray = [];
    const angleInterval = (2 * Math.PI / 8);
    for (let i = 0; i < 8; i++) {
      const newBullet = new Bullet(this.id, this.x, this.y,
        this.direction + i * angleInterval, this.username);
      bulletArray.push(newBullet);
    }
    return bulletArray;
  }
}

module.exports = ChiSheng1;