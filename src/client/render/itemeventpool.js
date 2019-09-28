import SpritePool from './spritepool';

export default class ItemEventPool extends SpritePool {
  constructor(app) {
    const imagePathHash = {
      CannonExplosion: 'assets/apple.png',
    }
    super(app, imagePathHash);
  }

  addSingle(me, itemEvent) {
    const { x, y, name } = itemEvent;
    const canvas = this.app.view;
    const texture = this.textures[name];
    const sprite = this.addSprite(texture);

    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.anchor.set(0.5);
  }

  setSingle(me, itemEvent, index) {
    const { x, y, name } = itemEvent;
    const canvas = this.app.view;
    const texture = this.textures[name];
    const sprite = this.sprites[index];

    // set position and texture
    sprite.x = canvas.width / 2 + x - me.x;
    sprite.y = canvas.height / 2 + y - me.y;
    sprite.texture = texture;

    // make it visible
    sprite.visible = true;
  }
}
