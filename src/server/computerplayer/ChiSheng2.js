const ComputerPlayer = require('./computerplayer');
const Bullet = require('../bullet');
const { MAP_SIZE } = require('../../shared/constants');
const { Point } = require('../../shared/utils');

// =====================================

const EPSILON = 2;

const SPEED = 300;
const ACC_COUNTER = 750; // acceleration counter
const ACC_DURATION = 15; // acceleration duration
const FAST_SPEED = 1500;

// =====================================

class ChiSheng2 extends ComputerPlayer {
  constructor(x, y) {
    super('ChiSheng2', '奇聖二號（電腦）', x, y);
    this.fireCooldown = 0.8;
    this.rotateSpeed = 0;
    this.speed = SPEED;

    this.accCounter = ACC_COUNTER;
    this.accDuration = ACC_DURATION;
  }

  move() {
    // accelaration
    this.speed = SPEED;
    if (this.accCounter !== 0) {
      this.accCounter -= 1;
    } else {
      if (this.accDuration === 0) {
        this.accCounter = ACC_COUNTER;
        this.accDuration = ACC_DURATION;
      } else {
        this.speed = FAST_SPEED;
        this.accDuration -= 1;
      }
    }
    // usually move by reflection, sometimes move by random
    if (Math.random() < 0.999) {
      this.moveByReflection();
    } else {
      this.rotateSpeed = 0;
      this.direction = Math.random() * 2 * Math.PI;
    }
  }

  moveByReflection() {
    // make sure the direction is between 0 and (2 * Math.PI)
    while (this.direction < 0) {
      this.direction += 2 * Math.PI;
    }
    this.direction = this.direction % (2 * Math.PI);

    // top left corner
    if (this.x <= EPSILON && this.y <= EPSILON) {
      this.rotateSpeed = 0;
      this.direction = (3/4 + 5/180*Math.random()) * Math.PI;
      return;
    }
    // top right corner
    if (this.x >= MAP_SIZE - EPSILON && this.y <= EPSILON) {
      this.rotateSpeed = 0;
      this.direction = (5/4 + 5/180*Math.random()) * Math.PI;
      return;
    }
    // bottom left corner
    if (this.x <= EPSILON && this.y >= MAP_SIZE - EPSILON) {
      this.rotateSpeed = 0;
      this.direction = (1/4 + 5/180*Math.random()) * Math.PI;
      return;
    }
    // bottom right corner
    if (this.x >= MAP_SIZE - EPSILON && this.y >= MAP_SIZE - EPSILON) {
      this.rotateSpeed = 0;
      this.direction = (7/4 + 5/180*Math.random()) * Math.PI;
      return;
    }
    // left boundary
    if (this.x <= EPSILON) {
      // left direction
      if (this.direction === 1.5 * Math.PI) {
        this.rotateSpeed = Math.PI;
        return;
      }
      // top left direction
      if (this.direction > 1.5 * Math.PI && this.direction < 2 * Math.PI) {
        this.rotateSpeed = 2 * (2 * Math.PI - this.direction);
        return;
      }
      // bottom left direction
      if (this.direction > Math.PI && this.direction < 1.5 * Math.PI) {
        this.rotateSpeed = -2 * (this.direction - Math.PI);
        return;
      }
    }
    // right boundary
    if (this.x >= MAP_SIZE - EPSILON) {
      // right direction
      if (this.direction === 0.5 * Math.PI) {
        this.rotateSpeed = Math.PI;
        return;
      }
      // top right direction
      if (this.direction > 0 && this.direction < 0.5 * Math.PI) {
        this.rotateSpeed = -2 * this.direction;
        return;
      }
      // bottom right direction
      if (this.direction > 0.5 * Math.PI && this.direction < Math.PI) {
        this.rotateSpeed = 2 * (Math.PI - this.direction);
        return;
      }
    }
    // top boundary
    if (this.y <= EPSILON) {
      // top direction
      if (this.direction === 0) {
        this.rotateSpeed = Math.PI;
        return;
      }
      // top left direction
      if (this.direction > 1.5 * Math.PI && this.direction < 2 * Math.PI) {
        this.rotateSpeed = -2 * (this.direction - 1.5 * Math.PI);
        return;
      }
      // top right direction
      if (this.direction > 0 && this.direction < 0.5 * Math.PI) {
        this.rotateSpeed = 2 * (0.5 * Math.PI - this.direction);
        return;
      }
    }
    // bottom boundary
    if (this.y >= MAP_SIZE - EPSILON) {
      // bottom direction
      if (this.direction === Math.PI) {
        this.rotateSpeed = Math.PI;
        return;
      }
      // bottom left direction
      if (this.direction > Math.PI && this.direction < 1.5 * Math.PI) {
        this.rotateSpeed = 2 * (1.5 * Math.PI - this.direction);
        return;
      }
      // bottom right direction
      if (this.direction > 0.5 * Math.PI && this.direction < Math.PI) {
        this.rotateSpeed = -2 * (this.direction - 0.5 * Math.PI);
        return;
      }
    }
    // not at boundary or corner
    this.rotateSpeed = 0;
  }

  shot() {
    const bulletArray = [];
    const angleInterval = (2 * Math.PI / 8);

    const bulletFront = new Bullet(this.id, this.x, this.y,
      this.direction,
      this.username);
    bulletArray.push(bulletFront);

    const bulletFrontLeft = new Bullet(this.id, this.x, this.y,
      this.direction - angleInterval,
      this.username);
    bulletArray.push(bulletFrontLeft);

    const bulletFrontRight = new Bullet(this.id, this.x, this.y,
      this.direction + angleInterval,
      this.username);
    bulletArray.push(bulletFrontRight);

    const bulletBack = new Bullet(this.id, this.x, this.y,
      this.direction + Math.PI,
      this.username);
    bulletArray.push(bulletBack);

    return bulletArray;
  }
}

module.exports = ChiSheng2;