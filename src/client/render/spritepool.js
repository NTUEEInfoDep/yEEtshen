import * as PIXI from 'pixi.js';

export default class SpritePool {
  // app: PIXI.application instance
  // imagePathHash: A hash table mapping from image names to their paths
  constructor(app, imagePathHash) {
    // Create a hash table mapping from image names to their textures
    const textures = {};
    for (let imageName in imagePathHash) {
      textures[imageName] = PIXI.Texture.from(imagePathHash[imageName]);
    }

    this.textures = textures;
    this.sprites = [];
    this.app = app;

    // The number of sprites that previous rendering shows.
    this.lastShowNum = 0;
  }

  // Destroy all sprites.
  destroy() {
    // Maybe this is not needed
    for (let i = 0, len = this.sprites.length; i < len; ++i) {
      this.app.stage.removeChild(this.sprites[i]);
      this.sprites[i].destroy(true);
    }
    this.sprites = [];
  }

  // Hide first `count` sprites in this.sprites
  hideMany(count) {
    const len = this.sprites.length;
    for (let i = 0; i < len; ++i) {
      this.sprites[i].visible = false;
    }
  }

  // Add a single image sprite into the sprite pool and return it.
  addSprite(texture) {
    const sprite = new PIXI.Sprite(texture);
    this.sprites.push(sprite);
    return sprite;
  }

  // Add a new "visible" image sprite into the sprite pool.
  addSingle(me, object) {
    console.error(
      'The "addSingle" function for sprite pool must be implemented!'
      );
  }

  // Set the property of single image sprite that has already in the
  // sprite pool.
  setSingle(me, object, index) {
    console.error(
      'The "setSingle" function for sprite pool must be implemented!'
      );
  }

  // Render many image sprites.
  render(me, objects) {
    const objectCount = objects.length;
    const poolLength = this.sprites.length;

    // hide original objects
    this.hideMany(this.lastShowNum);

    // set or add sprites and show them
    for (let i = 0; i < objectCount; i++) {
      if (i < poolLength) {
        this.setSingle(me, objects[i], i);
      } else {
        this.addSingle(me, objects[i]);
      }
    }

    // update lastShowNum
    this.lastShowNum = objectCount;
  }
}

