import * as PIXI from 'pixi.js';
import SpriteArray from './spriteArray';
import { } from '../../shared/constants';

export default class ItemArray extends SpriteArray {
  constructor(app) {
    const imagePathHash = {
      Bubble: 'assets/items/item_0.png',
      Healbag: 'assets/items/item_1.png',
      Weed: 'assets/items/item_2.png',
      LightSword: 'assets/items/item_3.png',
      Shield: 'assets/items/item_4.png',
      Bomb: 'assets/items/item_5.png',
      Cannon: 'assets/items/item_6.png',
      Shotgun: 'assets/items/item_7.png',
      FreezeBomb: 'assets/items/item_8.png',
    }
    const animationPathHash = {
    }
    super(app, imagePathHash, animationPathHash);
  }

  createSpriteFromObject(me, item) {
    const { id, x, y, name } = item;
    const canvas = this.app.view;
    const base_texture = this.textures['Bubble'];
    const texture = this.textures[name];
    const container = new PIXI.Container();
    const bubble = new PIXI.Sprite(base_texture);
    const sprite = new PIXI.Sprite(texture);
    // original size: x2


    container.addChild( bubble );
    container.addChild( sprite );
    this.addSprite( id, container );

    container.x = canvas.width / 2 + x - me.x;
    container.y = canvas.height / 2 + y - me.y;

    //bubble.alpha = 0.7;
    bubble.anchor.set(0.5);
    sprite.anchor.set(0.5);
  }

  updateSprite(me, sprite, itemEvent) {
    const { x, y } = itemEvent;
    const canvas = this.app.view;

    // set position
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
  }
}
