import * as PIXI from 'pixi.js';

export default class SpritePool {
  constructor(app, imagePath) {
    this.texture = PIXI.Texture.from(imagePath);
    this.sprites = [];
    this.app = app;
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
    // hide first `count` sprites in this.sprites, add new sprites if needed
    const len = this.sprites.length;
    for (let i = 0; i < len; ++i) {
      this.sprites[i].visible = false;
    }
    if (len < count) {
      for (let i = len; i < count; ++i) {
        const sprite = new PIXI.Sprite(this.texture);
        sprite.visible = false;
        this.app.stage.addChild(sprite);
        this.sprites.push(sprite);
      }
    }
  }

  showMany(count) {
    // show first `count` sprites in this.sprites
    for (let i = 0; i < count; ++i) {
      this.sprites[i].visible = true;
    }
  }
}

