import SpriteArray from './spriteArray';
import * as PIXI from 'pixi.js';
const shortid = require('shortid');

const { ANIMATION_SPEED, MAP_SIZE, BORDER_LENGTH } = require('../../shared/constants');

export default class BorderArray extends SpriteArray {
  constructor(app) {
    const imagePathHash = {
    }
    const animationPathHash = {
      border: {
        path: 'assets/lightning/lightning',
        frames: 3,
      }
    }
    super(app, imagePathHash, animationPathHash);

    for ( let i = 0; i < MAP_SIZE/BORDER_LENGTH ; i++ ) {
      this.createSpriteFromObject( BORDER_LENGTH * (i+0.5), 0, Math.PI / 2 );
      this.createSpriteFromObject( BORDER_LENGTH * (i+0.5), MAP_SIZE, Math.PI / 2 );
      this.createSpriteFromObject( 0, BORDER_LENGTH * (i+0.5), 0 );
      this.createSpriteFromObject( MAP_SIZE, BORDER_LENGTH * (i+0.5), 0 );
    }
  }

  createSpriteFromObject( x, y, direction ) {
    const sprite = new PIXI.AnimatedSprite(this.textures['border']);
    sprite.rotation = direction;
    sprite._x = x;
    sprite._y = y;
    sprite.anchor.set(0.5);
    sprite.animationSpeed = ANIMATION_SPEED;
    sprite.gotoAndPlay(Math.floor(Math.random()*3));
    sprite.visible = false;
    this.addSprite( shortid(), sprite );
  }

  updateSprite(me, sprite) {
    const { _x, _y } = sprite;
    const { x, y } = me;
    const { width, height } = this.app.view;
    if ( Math.abs(x - _x) < width && Math.abs(y - _y) < height ) {
      sprite.x = _x - x + width/2;
      sprite.y = _y - y + height/2;
      sprite.visible = true;
    } else {
      sprite.visible = false;
    }
  }

  render( me ) {
    Object.values( this.sprites ).forEach( border => {
      this.updateSprite( me, border );
    } )
  }
}
