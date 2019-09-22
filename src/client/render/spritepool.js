import * as PIXI from 'pixi.js';

export default class SpritePool {
  constructor(app, imagePath) {
    this.texture = PIXI.Texture.from(imagePath);
    this.sprites = [];
    this.app = app;

    // The number of sprites that previous rendering shows.
    this.lastShowNum = 0;
  }

  destroy() {
    // Maybe this is not needed
    for (let i = 0, len = this.sprites.length; i < len; ++i) {
      this.app.stage.removeChild(this.sprites[i]);
      this.sprites[i].destroy(true);
    }
    this.sprites = [];
  }

  hideMany(count) {
    // hide first `count` sprites in this.sprites
    const len = this.sprites.length;
    for (let i = 0; i < len; ++i) {
      this.sprites[i].visible = false;
    }
  }

  showMany(count) {
    // show first `count` sprites in this.sprites
    for (let i = 0; i < count; ++i) {
      this.sprites[i].visible = true;
    }
  }

  addMany(count) {
    // If `count` is positive, add `count` invisible sprites in this.sprites
    if (count <= 0) { return; }
    for (let i = 0; i < count; ++i){
      const sprite = new PIXI.Sprite(this.texture);
      sprite.visible = false;
      this.app.stage.addChild(sprite);
      this.sprites.push(sprite);
    }
  }
}

