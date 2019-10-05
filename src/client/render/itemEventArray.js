import * as PIXI from 'pixi.js';
import SpriteArray from './spriteArray';
import { ITEM_EVENTS_PARAMETERS, ANIMATION_SPEED } from '../../shared/constants';

export default class ItemEventArray extends SpriteArray {
  constructor(app) {
    const imagePathHash = {
    }
    const animationPathHash = {
      BombExplosion: {
        path: 'assets/bombExplosion/bombExplosion',
        frames: 19,
      },
      CannonExplosion: {
        path: 'assets/bombExplosion/bombExplosion',
        frames: 19,
      },
      FreezingArea: {
        path: 'assets/freezingArea/freezingArea',
        frames: 4,
      },
      Death: {
        path: 'assets/death/death',
        frames: 25,
      }
    }
    super(app, imagePathHash, animationPathHash);
  }

  createSpriteFromObject(me, itemEvent) {
    const { id, x, y, name, direction } = itemEvent;
    const canvas = this.app.view;
    const textures = this.textures[name];
    const sprite = new PIXI.AnimatedSprite(textures);
    this.addSprite( id, sprite );

    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.anchor.set(0.5);
    sprite.animationSpeed = ANIMATION_SPEED;
    sprite.visible = true;
    sprite.play();

    switch( name ) {
      case 'BombExplosion':
      case 'CannonExplosion':
      case 'Death':
        sprite.loop = false;
        break;
      case 'FreezingArea':
        break;
    }
  }

  updateSprite(me, sprite, itemEvent) {
    const { x, y, name, timestamp } = itemEvent;
    const canvas = this.app.view;

    // set position
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;

    /*
    switch( name ) {
      case 'BombExplosion':
      case 'CannonExplosion':
      case 'FreezingArea':
      default:
        break;
    }
    */
  }
}
