import * as PIXI from 'pixi.js';

export default class SpritePool {
  // app: PIXI.application instance
  // imagePathHash: A hash table mapping from image names to their paths
  constructor(app, imagePathHash, animationPathHash) {
    // Create a hash table mapping from image names to their textures
    const textures = {};
    for (let imageName in imagePathHash) {
      textures[imageName] = PIXI.Texture.from(imagePathHash[imageName]);
    }

    for (let animationName in animationPathHash ) {
      const textureArray = [];
      const width = (animationPathHash[animationName].frames > 10) ? 2 : 1;
      for (let i=0; i<animationPathHash[animationName].frames; i++) {
        const texture = PIXI.Texture.from( `${animationPathHash[animationName].path}_${i.toString().padStart(width, '0')}.png` );
        textureArray.push( texture );
      }
      textures[animationName] = textureArray;
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
    this.app.stage.addChild(sprite);
    return sprite;
  }

  // Add animated sprite
  addAnimatedSprite(textures) {
    const sprite = new PIXI.AnimatedSprite(textures);
    this.sprites.push(sprite);
    this.app.stage.addChild(sprite);
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

