const ComputerPlayer = require('./computerplayer');
const Bullet = require('../bullet');
const { MAP_SIZE } = require('../../shared/constants');
const { Point } = require('../../shared/utils');

// =====================================

const centralPoint = {x: MAP_SIZE / 2, y: MAP_SIZE / 2};

// =====================================

class ChiSheng1 extends ComputerPlayer {
  constructor(x, y) {
    super('ChiSheng1', '奇聖一號（電腦）', x, y);
    this.fireCooldown = 0.35;
    this.rotateSpeed = 0;
  }

  move() {
    // decide whether to change direction
    const testNum = Math.random();
    if (testNum < 0.1) {
      const directionVec = Point.directionToPoint(this.direction);
      // current point, use left bottom corner as origin
      const currentPoint = {x: this.x, y: MAP_SIZE - this.y};
      // current to central vector
      const curToCenVec = Point.subtract(centralPoint, currentPoint);
      const randomConstVec = Point.scale(Point.directionToPoint(Math.random() * 2 * Math.PI), 0.4 * MAP_SIZE);
      const curToCenVec1 = Point.add(curToCenVec, randomConstVec);// add a const vector to it
      const curToCenUnitVec = Point.unitVector(curToCenVec1);

      const newDirVec = Point.scale(Point.add(Point.scale(directionVec, 3), curToCenUnitVec), 1/4);

      this.direction = Point.direction(newDirVec);
    }
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