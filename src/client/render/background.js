import * as PIXI from 'pixi.js';

const Constants = require('../../shared/constants');
const MAP_SIZE = Constants.MAP_SIZE;

// ===========================================

export default class Background {
  constructor(app) {
    this.canvas = app.view;

    // Create the background
    const background = new PIXI.Graphics();
    this.background = background;
    app.stage.addChild(background);

    // Draw the background
    background.beginFill(0x000000);
    background.lineStyle(1, 0xffffff);
    background.drawRect(0, 0, MAP_SIZE, MAP_SIZE);
    background.endFill();
  }

  // When not playing.
  renderWhenNotPlaying() {
    this.background.x = -(MAP_SIZE - this.canvas.width) / 2;
    this.background.y = -(MAP_SIZE - this.canvas.height) / 2;
  }

  // When playing.
  render(player) {
    this.background.x = this.canvas.width / 2 - player.x;
    this.background.y = this.canvas.height / 2 - player.y;
  }
}
