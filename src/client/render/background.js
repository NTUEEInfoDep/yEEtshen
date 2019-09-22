import * as PIXI from 'pixi.js';

const Constants = require('../../shared/constants');
const MAP_SIZE = Constants.MAP_SIZE;

// ===========================================

class BackgroundRenderer {
  constructor(app) {
    this.canvas = app.view;

    // Create the background
    const background = new PIXI.Graphics();
    this.background = background;
    app.stage.addChild(background);

    // Draw the background
    background.beginFill(0x00ff00);
    background.lineStyle(1, 0xffffff);
    background.drawRect(0, 0, MAP_SIZE, MAP_SIZE);
    background.endFill();
  }

  // When the main menu show up.
  renderWhenMainMenu() {
    this.background.x = -(MAP_SIZE - this.canvas.width) / 2;
    this.background.y = -(MAP_SIZE - this.canvas.height) / 2;
  }

  // When a player is playing the game.
  renderWhenPlay(player) {
    this.background.x = this.canvas.width / 2 - player.x;
    this.background.y = this.canvas.height / 2 - player.y;
  }
}

// ===========================================

let backgroundRenderer = null;

// Create a new BackgroundRenderer instance.
//   app: PIXI.Application instance
export function initialize(app) {
  backgroundRenderer = new BackgroundRenderer(app);
}

export function renderWhenMainMenu() {
  backgroundRenderer.renderWhenMainMenu();
}

export function renderWhenPlay(player) {
  backgroundRenderer.renderWhenPlay(player);
}
