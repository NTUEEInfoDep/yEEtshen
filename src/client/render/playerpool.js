import SpritePool from './spritepool';

const { PLAYER_RADIUS } = require('../../shared/constants');

export default class PlayerPool extends SpritePool {
  constructor(app, texture) {
    super(app, texture);
  }

  renderPlayer(me, player, canvas, index) {
    const { x, y, direction } = player;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    this.sprites[index].x = canvasX;
    this.sprites[index].y = canvasY;
    this.sprites[index].anchor.x = 0.5;
    this.sprites[index].anchor.y = 0.5;
    this.sprites[index].rotation = direction;

    // Todo: add HealthBar
    // Todo: renderPlayerOnMonitor
  }

  render(me, players, canvas) {
    // hide origin bullet and push new bullet
    this.hideMany(players.length);
    // set sprite position
    players.forEach((player, index) => this.renderPlayer(me, player, canvas, index));
    // show the sprite
    this.showMany(players.length);
  }
}


// function addHealthBar(bar, canvasX, canvasY, playerHP) {
//   bar.drawRect(
//     0,
//     0,
//     // canvasX - PLAYER_RADIUS,
//     // canvasY + PLAYER_RADIUS + 8,
//     PLAYER_RADIUS * 2,
//     2
//   );
//   bar.endFill();

//   bar.beginFill(0xff0000);
//   bar.drawRect(
//     0,
//     0,
//     // canvasX - PLAYER_RADIUS + (PLAYER_RADIUS * 2 * playerHP) / PLAYER_MAX_HP,
//     // canvasY + PLAYER_RADIUS + 8,
//     PLAYER_RADIUS * 2 * (1 - playerHP / PLAYER_MAX_HP),
//     2
//   );
//   bar.endFill();
// }
