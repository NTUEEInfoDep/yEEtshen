import SpritePool from './spritepool';

const { ITEM_RADIUS } = require('../../shared/constants');

export default class ItemPool extends SpritePool {
  constructor(app) {
    const imagePathHash = {
      Healbag: 'assets/heart.svg',
      Shield: 'assets/shield.svg',
      LightSword: 'assets/lightSword.png',
      Bomb: 'assets/malware.svg',
      // FreezeBomb: 'assets/',
      // Weed: 'assets/',
      // Shotgun: 'assets/',
      // Cannon: 'assets/',
    }
    super(app, imagePathHash);
  }

  addSingle(me, item) {
    const { x, y, name } = item;
    const canvas = this.app.view;
    const texture = this.textures[name];
    const sprite = this.addSprite(texture);

    sprite.x = canvas.width / 2 + x - me.x - ITEM_RADIUS;
    sprite.y = canvas.height / 2 + y - me.y - ITEM_RADIUS;
    sprite.width = 2 * ITEM_RADIUS;
    sprite.height = 2 * ITEM_RADIUS;
  }

  setSingle(me, item, index) {
    const { x, y, name } = item;
    const canvas = this.app.view;
    const texture = this.textures[name];
    const sprite = this.sprites[index];

    // set position and texture
    sprite.x = canvas.width / 2 + x - me.x - ITEM_RADIUS;
    sprite.y = canvas.height / 2 + y - me.y - ITEM_RADIUS;
    sprite.texture = texture;

    // make it visible
    sprite.visible = true;
  }
}
