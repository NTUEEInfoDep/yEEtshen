import * as PIXI from 'pixi.js';

class Button {
  constructor(imagePath) {
    this.texture = PIXI.Texture.from(imagePath);
    this.btnSprite = new PIXI.Sprite(this.texture);
    this.btnSprite.visible = false;
    this.btnSprite.alpha = 0.5;
    this.btnSprite.anchor.set(0.5, 0.5);
    this.press = undefined;
    this.release = undefined;
  }

  setpos(x, y) {
    this.btnSprite.x = x;
    this.btnSprite.y = y;
  }

  unsubscribe() {
    this.btnSprite.visible = false;
    this.btnSprite.buttonMode = false;
    this.btnSprite.interactive = false;
  }

  subscribe() {
    if (this.press && this.release) {
      this.btnSprite.visible = true;
      this.btnSprite.buttonMode = true;
      this.btnSprite.interactive = true;
      this.btnSprite
        .on('pointerdown', this.press)
        .on('pointerup', this.release)
        .on('pointerupoutside', this.release);
    }
  }
}

const leftBtn = new Button('assets/leftBtn.png');
const rightBtn = new Button('assets/rightBtn.png');
const fireBtn = new Button('assets/gun.png');

export { leftBtn, rightBtn, fireBtn };
