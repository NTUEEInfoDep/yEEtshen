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

    const starAmount = 1000;
    // let cameraZ = 0;
    // const fov = 20;
    // const baseSpeed = 0.025;
    // let speed = 0;
    // let warpSpeed = 0;
    // const starStretch = 5;
    // const starBaseSize = 0.05;

    const stars = [];
    for (let i = 0; i < starAmount; i++) {
        const star = {
            sprite: new PIXI.Graphics(),
            x: 0,
            y: 0,
        };
        star.sprite.beginFill(0xFFFFFF);
        star.sprite.drawCircle(Math.random() * MAP_SIZE, Math.random() * MAP_SIZE, 2);
        star.sprite.endFill();
        background.addChild(star.sprite);
        stars.push(star);
    }
    this.stars = stars;
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

// Change flight speed every 5 seconds
