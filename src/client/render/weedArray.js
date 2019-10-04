import SpriteArray from './spriteArray';
import * as PIXI from 'pixi.js';
const shortid = require('shortid');

const { ANIMATION_SPEED, BULLET_RADIUS } = require('../../shared/constants');

export default class WeedArray extends SpriteArray {
  constructor(app) {
    const imagePathHash = {
    }
    // load the images of weeds
    const weedNum = 5;
    for ( let i = 0; i < weedNum; i ++ ) {
      imagePathHash[i] = `assets/weeds/weed_${i}.png`;
    }
    const animationPathHash = {
    }
    super(app, imagePathHash, animationPathHash);

    this.weedNum = weedNum;
    this.container.visible = false;

    for ( let i = 0; i < 50; i++ ) {
      this.createSpriteFromObject();
    }
  }

  createSpriteFromObject() {
    const canvas = this.app.view;
    const sprite = new PIXI.Sprite(this.textures[Math.floor(Math.random()*this.weedNum)]);

    sprite.x = Math.random() * canvas.width;
    sprite.y = Math.random() * canvas.height;
    sprite.rotation = Math.random()*2*Math.PI;
    sprite.anchor.set(0.5);
    sprite._rotation_speed = Math.random() * 2 * Math.PI / 2 + Math.PI / 2;
    sprite._direction = Math.random() * 2 * Math.PI;
    sprite._speed = Math.random() * 500 + 200;
    //sprite.height *= 2;
    //sprite.width *= 2;
    this.addSprite( shortid(), sprite);
  }

  updateSprite(sprite, dt) {
    const { _direction, _speed, _rotation_speed } = sprite;
    const canvas = this.app.view;

    sprite.x += dt * Math.sin(_direction) * _speed;
    sprite.y -= dt * Math.cos(_direction) * _speed;
    sprite.rotation += dt * _rotation_speed;
    const { x, y } = sprite;
    if ( y <= 0 || y >= canvas.height ) {
      sprite._direction = 180 - _direction;
    } else if ( x <= 0 || x >= canvas.width) {
      sprite._direction = - _direction;
    }
  }

  render( me, dt ) {
    if ( me.state.includes( 'weed' ) ) {
      if ( !this.container.visible ) {
        this.container.visible = true;
      }
      Object.values( this.sprites ).forEach( weed => {
        this.updateSprite( weed, dt );
      })
    } else {
      if ( this.container.visible ) {
        this.container.visible = false;
      }
    }
  }

}
