import SpritePool from './spritepool';

const { ITEM_RADIUS } = require('../../shared/constants');

export default class ItemPool extends SpritePool {
  constructor(app) {
    const imagePathHash = {
      Healbag: 'assets/apple.png',
      Shield: 'assets/apple.png',
      LightSword: 'assets/apple.png',
      Bomb: 'assets/apple.png',
      // FreezeBomb: 'assets/',
      // Weed: 'assets/',
      // Shotgun: 'assets/',
      Cannon: 'assets/apple.png',
    }
    super(app, imagePathHash);
  }

  addSingle(me, item) {
    const { x, y, name } = item;
    const canvas = this.app.view;
    const texture = this.textures[name];
    const sprite = this.addSprite(texture);

    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.anchor.set(0.5);
  }

  setSingle(me, item, index) {
    const { x, y, name } = item;
    const canvas = this.app.view;
    const texture = this.textures[name];
    const sprite = this.sprites[index];

    // set position and texture
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;

    // make it visible
    sprite.visible = true;
  }
}
