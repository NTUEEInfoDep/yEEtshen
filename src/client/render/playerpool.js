import SpritePool from './spritepool';

const { PLAYER_RADIUS } = require('../../shared/constants');

export default class PlayerPool extends SpritePool {
  constructor(app) {
    super(app, 'assets/ship.svg');
  }

  renderPlayer(me, player, index) {
    const { x, y, direction } = player;
    const canvas = this.app.view;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    this.sprites[index].x = canvasX;
    this.sprites[index].y = canvasY;
    this.sprites[index].width = 2 * PLAYER_RADIUS;
    this.sprites[index].height = 2 * PLAYER_RADIUS;
    this.sprites[index].anchor.x = 0.5;
    this.sprites[index].anchor.y = 0.5;
    this.sprites[index].rotation = direction;

    // Todo: add HealthBar
    // Todo: renderPlayerOnMonitor
  }

  render(me, others) {
    // hide origin players and push new players if needed
    this.hideMany(Math.max(others.length + 1, this.sprites.length));
    // render me
    this.renderPlayer(me, me, 0);
    // render others
    others.forEach((player, index) => this.renderPlayer(me, player, index + 1));
    // show the sprite
    this.showMany(others.length + 1);
  }
}
