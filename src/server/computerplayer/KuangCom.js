const ComputerPlayer = require('./computerplayer');
const Bullet = require('../bullet');
const Constants = require('../../shared/constants');

class KuangCom extends ComputerPlayer {
  constructor(x, y) {
    super('KuangCom', '廣哥號（電腦）', x, y);
    this.direction = Math.PI / 2;
    this.speed = 120;
    this.rotateSpeed = 0;
    this.shootAngle = this.direction;
    this.coolDown = 30;
    this.fireCooldown = 0.2;
  }

  move() {
    const size = Constants.MAP_SIZE;

    this.x = Math.max(500, Math.min(size - 500, this.x));
    this.y = Math.max(500, Math.min(size - 500, this.y));

    if (this.x <= 500 || this.x >= size - 500) {
      const mi = -this.direction - Math.PI / 4;
      const ma = -this.direction + Math.PI / 2;
      this.direction = Math.random() * (ma - mi) + mi;
    }
    else if (this.y <= 500 || this.y >= size - 500) {
      const mi = Math.PI / 2 - this.direction - Math.PI / 4;
      const ma = mi + Math.PI / 2;
      this.direction = Math.random() * (ma - mi) + mi;
    }
  }
  
 shot() {
    const bulletArray = [];
    if (this.coolDown < 0) this.coolDown = 30;
    if (this.coolDown < 9) {
      this.shootAngle += 10 * Math.PI / 180;
      for (let i = 0;i < 4; i++) {
        const bullet = new Bullet(this.id, this.x, this.y, this.shootAngle + i * Math.PI / 2, this.username);
        bullet.speed = 250;
        bulletArray.push(bullet);
      }
    }
    this.coolDown -= 1;
    return bulletArray;
  }

}

module.exports = KuangCom;
