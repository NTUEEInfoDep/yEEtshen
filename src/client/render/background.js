import * as PIXI from 'pixi.js';

const Constants = require('../../shared/constants');
const MAP_SIZE = Constants.MAP_SIZE;

// ===========================================

export default class Background {
  constructor(app) {

    this.canvas = app.view;
    const container = new PIXI.Container;
    this.container = container;
    app.stage.addChild( container );

    const imgPath = [
      "assets/background/star_0.png",
      "assets/background/star_1.png",
      "assets/background/star_2.png",
      "assets/background/star_3.png",
    ]
    this.textures = [];
    for ( let path of imgPath ) {
      const texture = new PIXI.Texture.from( path );
      this.textures.push( texture );
    }


    // use a picture as background (haven't draw the border yet)
    /*
    const backgroundTexture = new PIXI.Texture.from( 'assets/background/space.png' );
    const background = new PIXI.Sprite( backgroundTexture );
    this.container.addChild( background );
    this.background = background;
    */

    // or use black as background
    app.renderer.backgroundColor = 0x000;

    // draw a box
    const background = new PIXI.Graphics();
    this.background = background;
    app.stage.addChild(background);

    // Draw the background
    background.beginFill(0x000000);
    background.lineStyle(1, 0xffffff);
    background.drawRect(0, 0, MAP_SIZE, MAP_SIZE);
    background.endFill();
    container.addChild( background );

    // add stars
    this.spd_factors = [0.2, 0.4, 0.7, 1];
    this.stars = [];
    for ( let i in this.spd_factors ) {
      const star = new PIXI.TilingSprite( this.textures[i] );
      star.alpha = 0.8
      star.anchor.set(0.5);
      star.x = this.canvas.width/2;
      star.y = this.canvas.height/2;
      star.width = this.canvas.width;
      star.height = this.canvas.height;

      this.stars.push( star );
      this.container.addChild( star );
    }
  }

  // When not playing.
  renderWhenNotPlaying() {
    this.background.x = -(MAP_SIZE - this.canvas.width) / 2;
    this.background.y = -(MAP_SIZE - this.canvas.height) / 2;
  }

  // When playing.
  render(me) {

    this.background.x = this.canvas.width / 2 - me.x;
    this.background.y = this.canvas.height / 2 - me.y;

    for( let i in this.stars ) {
      const star = this.stars[i];
      const spd_factor = this.spd_factors[i];
      star.x = this.canvas.width/2;
      star.y = this.canvas.height/2;
      star.width = this.canvas.width;
      star.height = this.canvas.height;
      star.tilePosition.x = this.canvas.width / 2 - me.x * spd_factor;
      star.tilePosition.y = this.canvas.width / 2 - me.y * spd_factor;
    }
  }
}
