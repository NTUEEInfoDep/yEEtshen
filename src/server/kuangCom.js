const ComputerPlayer = require('./computerplayer');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');
const Item = require('./Items/');
const ItemEvent = require('./ItemEvents/');

class KuangCom extends ComputerPlayer {
  constructor(id, username, x, y) {
    super(id, username, x, y);
    this.direction = Math.PI / 2;
    this.speed = 100;
    this.rotateSpeed = 0;
    this.shootAngle = this.direction;
    this.coolDown = 30;
  }

  move() {
    const size = Constants.MAP_SIZE;
    if (this.x <= 300 || this.x >= size - 300 || this.y <= 300 || this.y >= size - 300) {
      const mi = -this.direction
      const ma = -this.direction + Math.PI / 4;
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
