import SpriteArray from './spriteArray';
import * as PIXI from 'pixi.js';

const { ANIMATION_SPEED, BULLET_RADIUS } = require('../../shared/constants');

export default class BulletArray extends SpriteArray {
  constructor(app) {
    const imagePathHash = {
    }
    const animationPathHash = {
      bullet: {
        path: 'assets/bullet/bullet',
        frames: 5,
      }
    }
    super(app, imagePathHash, animationPathHash);
  }

  createSpriteFromObject(me, bullet) {
    const { id, x, y, direction } = bullet;
    const canvas = this.app.view;
    const sprite = new PIXI.AnimatedSprite(this.textures['bullet']);

    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.animationSpeed = ANIMATION_SPEED;
    sprite.rotation = direction;
    sprite.anchor.set(0.5);
    sprite.play();
    this.addSprite(id, sprite);
  }

  updateSprite(me, sprite, bullet) {
    const { x, y } = bullet;
    const canvas = this.app.view;

    // set position
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
  }
}
