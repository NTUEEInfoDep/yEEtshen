import SpriteArray from './spriteArray';
import * as PIXI from 'pixi.js';
const shortid = require('shortid');

const { ANIMATION_SPEED, BULLET_RADIUS } = require('../../shared/constants');

export default class WeedArray extends SpriteArray {
  constructor(app) {
    const imagePathHash = {
      weed: 'assets/weeds/weed.png',
      text0: 'assets/weeds/text_0.png',
      text1: 'assets/weeds/text_1.png',
      text2: 'assets/weeds/text_2.png',
      text3: 'assets/weeds/text_3.png',
    }
    const animationPathHash = {
      red: {
        path: 'assets/weeds/red/red',
        frames: 6,
      },
    }
    super(app, imagePathHash, animationPathHash);

    this.container.visible = false;

    for ( let i = 0; i < 20; i++ ) {
      this.createSpriteFromObject( 'weed' );
    }
    for ( let i = 0; i < 2; i++ ) {
      this.createSpriteFromObject( 'text0' );
      this.createSpriteFromObject( 'text1' );
      this.createSpriteFromObject( 'text2' );
      this.createSpriteFromObject( 'text3' );
    }
    for ( let i = 0; i < 10; i++ ) {
      this.createSpriteFromObject( 'red' );
    }
  }

  createSpriteFromObject( name ) {
    const canvas = this.app.view;
    let sprite = null;
    if ( name != 'red' ) {
      sprite = new PIXI.Sprite(this.textures[name]);
    } else {
      sprite = new PIXI.AnimatedSprite( this.textures[name] );
      sprite.animationSpeed = ANIMATION_SPEED;
      sprite.play();
    }
    sprite.x = canvas.width/2;
    sprite.y = canvas.height/2;
    sprite.rotation = Math.random()*2*Math.PI;
    sprite.anchor.set(0.5);
    sprite._rotation_speed = Math.random() * 2 * Math.PI / 2 + Math.PI / 3;
    sprite._direction = Math.random() * 2 * Math.PI;
    sprite._speed = Math.random() * 500 + 200;
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
        const canvas = this.app.view;
        Object.values( this.sprites ).forEach( weed => {
          weed.x = canvas.width/2;
          weed.y = canvas.height/2;
        })
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
