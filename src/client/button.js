import * as PIXI from 'pixi.js';

export default class Button {
  constructor(app, imagePath) {
    this.app = app;
    this.texture = PIXI.Texture.from(imagePath);
    this.btnSprite = null;
  }

  destroy() {
    this.app.stage.removeChild(this.btnSprite);
    this.btnSprite.destroy(true);
  }

  unsubscribe() {
    this.btnSprite.visible = false;
    this.btnSprite.buttonMode = false;
    this.btnSprite.interactive = false;
  }

  render() {
    if (!this.btnSprite) {
      this.btnSprite = new PIXI.Sprite(this.texture);
      this.app.stage.addChild(this.btnSprite);
      return;
    }
    this.btnSprite.visible = true;
    this.btnSprite.buttonMode = true;
    this.btnSprite.interactive = true;
  }
}
