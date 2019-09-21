import SpritePool from './spritepool';

const { BULLET_RADIUS } = require('../../shared/constants');

export default class BulletPool extends SpritePool {
  constructor(app, texture) {
    super(app, texture);
  }

  renderBullet(me, bullet, canvas, index) {
    const { x, y } = bullet;
      this.sprites[index].x = canvas.width / 2 + x - me.x - BULLET_RADIUS;
      this.sprites[index].y = canvas.height / 2 + y - me.y - BULLET_RADIUS;
  }

  render(me, bullets, canvas) {
    // hide origin bullet and push new bullet
    this.hideMany(bullets.length);
    // set sprite position
    bullets.forEach((i, index) => this.renderBullet(me, i, canvas, index));
    // show the sprite
    this.showMany(bullets.length);
  }
}
