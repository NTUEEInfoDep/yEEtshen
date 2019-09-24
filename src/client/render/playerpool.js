import SpritePool from './spritepool';
import HealthBar from './healthbar';

const { PLAYER_RADIUS } = require('../../shared/constants');

export default class PlayerPool extends SpritePool {
  constructor(app) {
    const imagePathHash = {
      player: 'assets/ship.svg',
    }
    super(app, imagePathHash);
  }

  addSingle(me, player) {
    const { x, y, direction } = player;
    const canvas = this.app.view;
    const sprite = this.addSprite(this.textures['player']);

    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.width = 2 * PLAYER_RADIUS;
    sprite.height = 2 * PLAYER_RADIUS;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.rotation = direction;

    // health bar
    const healthbar = HealthBar.newHealthBar();
    sprite.addChild(healthbar);
  }

  setSingle(me, player, index) {
    const { x, y, direction, hp } = player;
    const canvas = this.app.view;
    const sprite = this.sprites[index];

    // set position and direction
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.rotation = direction;

    // health bar
    const healthbar = sprite.children[0];
    HealthBar.setHealth(healthbar, hp);

    // make it visible
    sprite.visible = true;
  }

  render(me, others) {
    const otherCount = others.length;
    const poolLength = this.sprites.length;

    // hide original objects
    this.hideMany(this.lastShowNum);

    // set or add me and show
    if (poolLength) {
      this.setSingle(me, me, 0);
    } else {
      this.addSingle(me, me);
    }

    // set or add others and show them
    for (let i = 0; i < otherCount; i++) {
      if ((i + 1) < poolLength) {
        this.setSingle(me, others[i], i + 1);
      } else {
        this.addSingle(me, others[i]);
      }
    }

    // update lastShowNum
    this.lastShowNum = otherCount + 1;
  }
}
