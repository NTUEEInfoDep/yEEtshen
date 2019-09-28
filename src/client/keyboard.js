export default class Keyboard {
  constructor(val) {
    this.val = val;
    this.idDown = false;
    this.isUp = true;
    this.press = undefined;
    this.release = undefined;
    this.downHandler = this.downHandler.bind(this);
    this.upHandler = this.upHandler.bind(this);
  }

  downHandler(e) {
    if (e.key === this.val) {
      if (this.isUp && this.press) this.press();
      this.isUp = false;
      this.isDown = true;
      e.preventDefault();
    }
  }

  upHandler(e) {
    if (e.key === this.val) {
      if (this.isDown && this.release) this.release();
      this.isDown = false;
      this.isUp = true;
      e.preventDefault();
    }
  }

  subscribe() {
    window.addEventListener('keydown', this.downHandler, false);
    window.addEventListener('keyup', this.upHandler, false);
  }

  unsubscribe() {
    window.removeEventListener('keydown', this.downHandler);
    window.removeEventListener('keyup', this.upHandler);
  }
}
