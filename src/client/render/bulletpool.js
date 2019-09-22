import SpritePool from './spritepool';

const { BULLET_RADIUS } = require('../../shared/constants');

export default class BulletPool extends SpritePool {
  constructor(app) {
    super(app, 'assets/bullet.svg');
  }

  renderBullet(me, bullet, index) {
    const { x, y } = bullet;
    const canvas = this.app.view;

    this.sprites[index].x = canvas.width / 2 + x - me.x - BULLET_RADIUS;
    this.sprites[index].y = canvas.height / 2 + y - me.y - BULLET_RADIUS;
    this.sprites[index].width = 2 * BULLET_RADIUS;
    this.sprites[index].height = 2 * BULLET_RADIUS;
  }

  render(me, bullets) {
    const bulletCount = bullets.length;
    // hide original bullets
    this.hideMany(this.lastShowNum);
    // add new bullet sprites if needed
    this.addMany(bulletCount - this.sprites.length);
    // set sprite position
    bullets.forEach((bullet, index) => this.renderBullet(me, bullet, index));
    // show the sprite and update lastShowNum
    this.showMany(bulletCount);
    this.lastShowNum = bulletCount;
  }
}
