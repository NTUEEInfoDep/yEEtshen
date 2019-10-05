import * as PIXI from 'pixi.js';
import SpriteArray from './spriteArray';

const { ANIMATION_SPEED, PLAYER_RADIUS, PLAYER_MAX_HP, PLAYER_MAX_BULLET_NUM } = require('../../shared/constants');
const lineColor = 0x000000;

// ============================================

class HealthBar {
  constructor() {
    this.width = 3 * PLAYER_RADIUS;
    this.height = 10;
    this.interval = this.width / PLAYER_MAX_HP;

    // The offset with respect to the center of the player.
    this.offsetX = -(this.width/2.4);
    this.offsetY = 1.3 * PLAYER_RADIUS;
  }

  // Use PIXI.Graphics draw a health bar and return it.
  create() {
    // health bar
    const healthbar = new PIXI.Container();

    // health
    const health = new PIXI.Graphics();
    health.beginFill(0xf02929, 1);
    health.lineStyle(1, 0, lineColor);
    health.drawRect(0, 0, this.width, this.height);
    health.endFill();
    healthbar.addChild(health);

    // border
    const border = new PIXI.Graphics();
    border.beginFill(0, 0);
    border.lineStyle(1, lineColor);
    border.drawRect(0, 0, this.width, this.height);
    border.endFill();
    healthbar.addChild(border);

    // dividing line
    for (let i = 1; i < PLAYER_MAX_HP; i++) {
      const divLine = new PIXI.Graphics();
      divLine.lineStyle(1, lineColor);
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
    healthbar.children[0].width = Math.ceil(num) * this.interval;
  }
}

class BulletNumBar {
  constructor() {
    this.width = 3 * PLAYER_RADIUS;
    this.height = 10;
    this.interval = this.width / PLAYER_MAX_BULLET_NUM;

    // The offset with respect to the center of the player.
    this.offsetX = -(this.width/2.4);
    this.offsetY = 1.6 * PLAYER_RADIUS;
  }

  // Use PIXI.Graphics draw a bullet num bar and return it.
  create() {
    // bullet num bar
    const bulletNumBar = new PIXI.Container();

    // bulletNum
    const bulletNum = new PIXI.Graphics();
    bulletNum.beginFill(0xffb400, 1);
    bulletNum.lineStyle(1, lineColor);
    bulletNum.drawRect(0, 0, this.width, this.height);
    bulletNum.endFill();
    bulletNumBar.addChild(bulletNum);

    // border
    const border = new PIXI.Graphics();
    border.beginFill(0, 0);
    border.lineStyle(1, lineColor);
    border.drawRect(0, 0, this.width, this.height);
    border.endFill();
    bulletNumBar.addChild(border);

    // dividing line
    for (let i = 1; i < PLAYER_MAX_BULLET_NUM; i++) {
      const divLine = new PIXI.Graphics();
      divLine.lineStyle(1, lineColor);
      divLine.moveTo(i * this.interval, 0);
      divLine.lineTo(i * this.interval, this.height);
      bulletNumBar.addChild(divLine);
    }

    // adjust the position
    bulletNumBar.x = this.offsetX;
    bulletNumBar.y = this.offsetY;

    return bulletNumBar;
  }

  // Set the health of a health bar
  setBulletNum(bulletNumBar, num) {
    bulletNumBar.children[0].width = num * this.interval;
  }
}

// ============================================

class UsernameText {
  constructor() {
    // The offset with respect to the center of the player.
    this.offsetY = 2 * PLAYER_RADIUS;

    this.style = new PIXI.TextStyle({
      fontSize: 16,
      fill: 0xffffff,
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

  // Update the text of the username
  update(usernameText, username) {
    usernameText.text = username;

    // adjust the position
    usernameText.x = -(usernameText.width)/2;
  }
}

// ============================================

export default class PlayerArray extends SpriteArray {
  constructor(app) {
    const imagePathHash = {
      Bubble: 'assets/items/bubble_small.png',
      Bomb: 'assets/items/item_5.png',
      Cannon: 'assets/items/item_6.png',
      Shotgun: 'assets/items/item_7.png',
      FreezeBomb: 'assets/items/item_8.png',
      freeze: 'assets/frozen.png',
    };
    for(let idx = 0; idx < 8; ++idx)
      imagePathHash[`ship${idx}`] = `assets/spaceships/ship${idx.toString()}.png`;

    const animationPathHash = {
      lightSword: {
        path: 'assets/lightSword/lightSword',
        frames: 4,
      },
      shield: {
        path: 'assets/shield/shield',
        frames: 7,
      },
      engine: {
        path: 'assets/engine/engine',
        frames: 3,
      }
    }
    super(app, imagePathHash, animationPathHash);

    this.healthbar = new HealthBar();
    this.usernameText = new UsernameText();
    this.bulletNumBar = new BulletNumBar();
  }

  createSpriteFromObject(me, player) {
    // The container that holds all stuffs related to player.
    const { id, x, y, direction, username, spriteIdx } = player;
    const playerContainer = new PIXI.Container();
    this.addSprite( id, playerContainer );

    //lightSword sprite
    const lightSword = new PIXI.AnimatedSprite( this.textures['lightSword'] );
    lightSword.animationSpeed = ANIMATION_SPEED;
    lightSword.visible = false;
    lightSword.anchor.set(0.5);
    lightSword.play();
    playerContainer.addChild( lightSword );

    //engine
    const engine = new PIXI.AnimatedSprite( this.textures['engine'] );
    engine.animationSpeed = ANIMATION_SPEED;
    engine.play();
    engine.anchor.set(0.5);
    playerContainer.addChild( engine );

    // The player sprite
    const canvas = this.app.view;
    const texture = this.textures[`ship${spriteIdx}`];
    const sprite = new PIXI.Sprite(texture);
    playerContainer.addChild(sprite);

    //shield sprite
    const shield = new PIXI.AnimatedSprite( this.textures['shield'] );
    shield.animationSpeed = 0.25;
    shield.visible = false;
    shield.play();
    shield.anchor.set(0.5);
    playerContainer.addChild( shield );

    //shield sprite
    const freeze = new PIXI.Sprite( this.textures['freeze'] );
    freeze.visible = false;
    freeze.anchor.set(0.5);
    freeze.alpha = 0.6;
    playerContainer.addChild( freeze );

    // set position and direction
    playerContainer.x = canvas.width / 2 + x - me.x;
    playerContainer.y = canvas.height / 2 + y - me.y;
    sprite.anchor.set(0.5);
    sprite.rotation = direction;


    // username
    const usernameText = this.usernameText.create(username);
    playerContainer.addChild(usernameText);

    // bullet num bar
    const bulletNumBar = this.bulletNumBar.create();
    playerContainer.addChild(bulletNumBar);

    // health bar
    const healthbar = this.healthbar.create();
    playerContainer.addChild(healthbar);

    // item bubble
    const bubble = new PIXI.Sprite( this.textures['Bubble'] );
    playerContainer.addChild(bubble);
    bubble.x = -2.3* PLAYER_RADIUS;
    bubble.y = 0.85 * PLAYER_RADIUS;

    // item
    const item = new PIXI.Sprite( this.textures['Bomb']);
    item.visible = false;
    playerContainer.addChild(item);
    item.x = -2.3* PLAYER_RADIUS;
    item.y = 0.85 * PLAYER_RADIUS;
  }

  updateSprite(me, playerContainer, player) {
    const { x, y, direction, username, hp, bulletNum, item } = player;
    const canvas = this.app.view;
    const lightSword = playerContainer.children[0];
    const engine = playerContainer.children[1];
    const sprite = playerContainer.children[2];
    const shield = playerContainer.children[3];
    const freeze = playerContainer.children[4];
    const usernameText = playerContainer.children[5];
    const bulletNumBar = playerContainer.children[6];
    const healthbar = playerContainer.children[7];
    const bubble = playerContainer.children[8];
    const itemIcon = playerContainer.children[9];

    // set position and direction
    playerContainer.x = canvas.width / 2 + x - me.x;
    playerContainer.y = canvas.height / 2 + y - me.y;
    sprite.rotation = direction;
    engine.rotation = direction;

    // health bar
    this.healthbar.setHealth(healthbar, hp);


    // username
    this.usernameText.update(usernameText, username);

    // bullet num bar
    this.bulletNumBar.setBulletNum(bulletNumBar, bulletNum);

    if ( item ) {
      itemIcon.texture = this.textures[item];
      itemIcon.visible = true;
    } else {
      itemIcon.visible = false;
    }

    // lightSword
    if ( player.state.includes( 'lightSword' ) ) {
      lightSword.visible = true;
    } else {
      lightSword.visible = false;
    }

    // shield
    if ( player.state.includes( 'shield' ) ) {
      shield.visible = true;
    } else { 
      shield.visible = false;
    }

    // freeze
    if ( player.state.includes('freeze') ) {
      freeze.rotation = direction;
      freeze.visible = true;
      engine.visible = false;
    } else {
      freeze.visible = false;
      engine.visible = true;
    }

    if ( player.state.includes('damaged') ) {
      if ( Date.now() % 300 > 150 ) {
        playerContainer.visible = false;
      } else {
        playerContainer.visible = true;
      }
    } else {
      playerContainer.visible = true;
    }
  }
}
