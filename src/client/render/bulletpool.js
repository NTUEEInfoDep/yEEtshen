import SpritePool from './spritepool';

const { BULLET_RADIUS } = require('../../shared/constants');

export default class BulletPool extends SpritePool {
  constructor(app) {
    const imagePathHash = {
      bullet: 'assets/bullet.png',
    }
    super(app, imagePathHash);
  }

  addSingle(me, bullet) {
    const { x, y } = bullet;
    const canvas = this.app.view;
    const sprite = this.addSprite(this.textures['bullet']);

    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    //sprite.width = 2 * BULLET_RADIUS;
    //sprite.height = 2 * BULLET_RADIUS;
    sprite.anchor.set(0.5);
  }

  setSingle(me, bullet, index) {
    const { x, y } = bullet;
    const canvas = this.app.view;
    const sprite = this.sprites[index];

    // set position
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;

    // make it visible
    sprite.visible = true;
  }
}
