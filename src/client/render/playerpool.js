import * as PIXI from 'pixi.js';
import SpritePool from './spritepool';

const { PLAYER_RADIUS, PLAYER_MAX_HP } = require('../../shared/constants');

// ============================================

class HealthBar {
  constructor() {
    this.width = 4 * PLAYER_RADIUS;
    this.height = 8;
    this.interval = this.width / PLAYER_MAX_HP;

    // The offset with respect to the center of the player.
    this.offsetX = -(this.width/2);
    this.offsetY = 1.5 * PLAYER_RADIUS;
  }

  // Use PIXI.Graphics draw a health bar and return it.
  create() {
    // health bar
    const healthbar = new PIXI.Container();

    // health
    const health = new PIXI.Graphics();
    health.beginFill(0xff0000);
    health.lineStyle(1, 0, 0);
    health.drawRect(0, 0, this.width, this.height);
    health.endFill();
    healthbar.addChild(health);

    // border
    const border = new PIXI.Graphics();
    border.beginFill(0, 0);
    border.lineStyle(1, 0x000000);
    border.drawRect(0, 0, this.width, this.height);
    border.endFill();
    healthbar.addChild(border);

    // dividing line
    for (let i = 1; i < PLAYER_MAX_HP; i++) {
      const divLine = new PIXI.Graphics();
      divLine.lineStyle(1, 0x000000);
      divLine.moveTo(i * this.interval, 0);
      divLine.lineTo(i * this.interval, this.height);
      healthbar.addChild(divLine);
    }

    // adjust the position
    healthbar.x = this.offsetX;
    healthbar.y = this.offsetY;

    return healthbar;
  }

  // Set the health of a health bar
  setHealth(healthbar, num) {
    healthbar.children[0].width = num * this.interval;
  }
}

// ============================================

class UsernameText {
  constructor() {
    // The offset with respect to the center of the player.
    this.offsetY = 2 * PLAYER_RADIUS;

    this.style = new PIXI.TextStyle({
      fontSize: 20,
    });

  }

  // Return a PIXI.Text instance.
  create(username) {
    const usernameText = new PIXI.Text(username, this.style);

    // adjust the position
    usernameText.x = -(usernameText.width)/2;
    usernameText.y = this.offsetY;

    return usernameText;
  }
}

// ============================================

export default class PlayerPool extends SpritePool {
  constructor(app) {
    const imagePathHash = {
      player: 'assets/ship.svg',
    }
    super(app, imagePathHash);

    this.healthbar = new HealthBar();
    this.usernameText = new UsernameText();
  }

  addSingle(me, player) {
    const { x, y, direction, username } = player;
    const canvas = this.app.view;
    const sprite = this.addSprite(this.textures['player']);

    // set position and direction
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.width = 2 * PLAYER_RADIUS;
    sprite.height = 2 * PLAYER_RADIUS;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.rotation = direction;

    // health bar
    const healthbar = this.healthbar.create();
    sprite.addChild(healthbar);

    // username
    const usernameText = this.usernameText.create(username);
    sprite.addChild(usernameText);
  }

  setSingle(me, player, index) {
    const { x, y, direction, hp } = player;
    const canvas = this.app.view;
    const sprite = this.sprites[index];

    // set position and direction
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.rotation = direction;

    // health bar
    const healthbar = sprite.children[0];
    this.healthbar.setHealth(healthbar, hp);

    // make it visible
    sprite.visible = true;
  }

  render(me, others) {
    const otherCount = others.length;
    const poolLength = this.sprites.length;

    // hide original objects
    this.hideMany(this.lastShowNum);

    // set or add me and show
    if (poolLength) {
      this.setSingle(me, me, 0);
    } else {
      this.addSingle(me, me);
    }

    // set or add others and show them
    for (let i = 0; i < otherCount; i++) {
      if ((i + 1) < poolLength) {
        this.setSingle(me, others[i], i + 1);
      } else {
        this.addSingle(me, others[i]);
      }
    }

    // update lastShowNum
    this.lastShowNum = otherCount + 1;
  }
}
