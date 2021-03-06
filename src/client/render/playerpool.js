import * as PIXI from 'pixi.js';
import SpritePool from './spritepool';

const { ANIMATION_SPEED, PLAYER_RADIUS, PLAYER_MAX_HP } = require('../../shared/constants');

// ============================================

class HealthBar {
  constructor() {
    this.width = 3 * PLAYER_RADIUS;
    this.height = 6;
    this.interval = this.width / PLAYER_MAX_HP;

    // The offset with respect to the center of the player.
    this.offsetX = -(this.width/2);
    this.offsetY = 1.3 * PLAYER_RADIUS;
  }

  // Use PIXI.Graphics draw a health bar and return it.
  create() {
    // health bar
    const healthbar = new PIXI.Container();

    // health
    const health = new PIXI.Graphics();
    health.beginFill(0xf02929, 1);
    health.lineStyle(1, 0, 0);
    health.drawRect(0, 0, this.width, this.height);
    health.endFill();
    healthbar.addChild(health);

    // border
    const border = new PIXI.Graphics();
    border.beginFill(0, 0);
    border.lineStyle(1, 0xff7d7d);
    border.drawRect(0, 0, this.width, this.height);
    border.endFill();
    healthbar.addChild(border);

    // dividing line
    for (let i = 1; i < PLAYER_MAX_HP; i++) {
      const divLine = new PIXI.Graphics();
      divLine.lineStyle(1, 0xad0000);
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
    this.offsetY = 1.7 * PLAYER_RADIUS;

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

export default class PlayerPool extends SpritePool {
  constructor(app) {
    const imagePathHash = {};
    for(let idx = 1; idx <= 13; ++idx)
      //imagePathHash[`sprite${idx}`] = `assets/spaceships/ship${idx.toString()}.png`;
      imagePathHash[`sprite${idx}`] = `assets/spaceships/ship.png`;

    const animationPathHash = {
      lightSword: {
        path: 'assets/lightSword/lightSword',
        frames: 4,
      },
      shield: {
        path: 'assets/shield/shield',
        frames: 7,
      },
    }
    super(app, imagePathHash, animationPathHash);

    this.healthbar = new HealthBar();
    this.usernameText = new UsernameText();
  }

  addSingle(me, player) {
    // The container that holds all stuffs related to player.
    const playerContainer = new PIXI.Container();
    this.sprites.push(playerContainer);
    this.app.stage.addChild(playerContainer);

    //lightSword sprite
    const lightSword = new PIXI.AnimatedSprite( this.textures['lightSword'] );
    lightSword.animationSpeed = ANIMATION_SPEED;
    lightSword.visible = false;
    lightSword.anchor.set(0.5);
    playerContainer.addChild( lightSword );
    lightSword.width *= 2;
    lightSword.height *= 2;

    // The player sprite
    const { x, y, direction, username, spriteIdx } = player;
    const canvas = this.app.view;
    const texture = this.textures[`sprite${spriteIdx}`];
    const sprite = new PIXI.Sprite(texture);
    playerContainer.addChild(sprite);
    sprite.width *= 2;
    sprite.height *= 2;

    //shield sprite
    const shield = new PIXI.AnimatedSprite( this.textures['shield'] );
    shield.animationSpeed = 0.25;
    shield.visible = false;
    shield.anchor.set(0.5);
    playerContainer.addChild( shield );
    shield.height *= 2;
    shield.width *= 2;

    // set position and direction
    playerContainer.x = canvas.width / 2 + x - me.x;
    playerContainer.y = canvas.height / 2 + y - me.y;
    sprite.anchor.set(0.5);
    sprite.rotation = direction;

    // health bar
    const healthbar = this.healthbar.create();
    playerContainer.addChild(healthbar);

    // username
    const usernameText = this.usernameText.create(username);
    playerContainer.addChild(usernameText);
  }

  setSingle(me, player, index) {
    const { x, y, direction, username, hp, spriteIdx } = player;
    const canvas = this.app.view;
    const texture = this.textures[`sprite${spriteIdx}`];
    const playerContainer = this.sprites[index];
    const lightSword = playerContainer.children[0];
    const sprite = playerContainer.children[1];
    const shield = playerContainer.children[2];
    const healthbar = playerContainer.children[3];
    const usernameText = playerContainer.children[4];

    // set position and direction
    playerContainer.x = canvas.width / 2 + x - me.x;
    playerContainer.y = canvas.height / 2 + y - me.y;
    sprite.rotation = direction;

    // set texture
    sprite.texture = texture;

    // health bar
    this.healthbar.setHealth(healthbar, hp);

    // username
    this.usernameText.update(usernameText, username);


    // lightSword
    if ( player.state.includes( 'lightSword' ) ) {
      lightSword.visible = true;
      lightSword.play();
    } else {
      lightSword.visible = false;
    }

    // shield
    if ( player.state.includes( 'shield' ) ) {
      shield.visible = true;
      shield.play();
    } else { 
      shield.visible = false;
    }

    // make it visible
    playerContainer.visible = true;
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
