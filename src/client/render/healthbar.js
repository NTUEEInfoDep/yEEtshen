import * as PIXI from 'pixi.js';

// ==================================

const { PLAYER_RADIUS, PLAYER_MAX_HP } = require('../../shared/constants');
const width = 4 * PLAYER_RADIUS;
const height = 8;
const interval = width / PLAYER_MAX_HP;
const offsetX = -(width/2);
const offsetY = 1.5 * PLAYER_RADIUS;

// ==================================

export default class HealthBar {
  // Use PIXI.Graphics draw a health bar and return it.
  static newHealthBar() {
    // health bar
    const healthbar = new PIXI.Container();

    // health
    const health = new PIXI.Graphics();
    health.beginFill(0xff0000);
    health.lineStyle(1, 0, 0);
    health.drawRect(0, 0, width, height);
    health.endFill();
    healthbar.addChild(health);

    // border
    const border = new PIXI.Graphics();
    border.beginFill(0, 0);
    border.lineStyle(1, 0x000000);
    border.drawRect(0, 0, width, height);
    border.endFill();
    healthbar.addChild(border);

    // dividing line
    for (let i = 1; i < PLAYER_MAX_HP; i++) {
      const divLine = new PIXI.Graphics();
      divLine.lineStyle(1, 0x000000);
      divLine.moveTo(i * interval, 0);
      divLine.lineTo(i * interval, height);
      healthbar.addChild(divLine);
    }

    // adjust the position
    healthbar.x = offsetX;
    healthbar.y = offsetY;

    return healthbar;
  }

  // Set the health of a health bar
  static setHealth(healthbar, num) {
    healthbar.children[0].width = num * interval;
  }
}
