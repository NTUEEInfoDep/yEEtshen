import * as PIXI from 'pixi.js';

export default class SpriteArray {
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
      const width = Math.ceil( Math.log10(animationPathHash[animationName].frames) );
      for (let i=0; i<animationPathHash[animationName].frames; i++) {
        const texture = PIXI.Texture.from( `${animationPathHash[animationName].path}_${i.toString().padStart(width, '0')}.png` );
        textureArray.push( texture );
      }
      textures[animationName] = textureArray;
    }

    this.textures = textures;
    this.sprites = {};
    this.app = app;
    this.container = new PIXI.Container();
    this.app.stage.addChild( this.container );
  }


  createSpriteFromObject( me, object ) {
    console.error(
      'The "createSpriteFromObject" function for sprite array must be implemented!'
      );
  }

  // add a new sprite, only called by createSpriteFromObject()
  addSprite(id, sprite) {
    this.sprites[id] = sprite;
    this.container.addChild(sprite);
    return sprite;
  }

  removeSprite(id) {
      const sprite = this.sprites[id];
      this.container.removeChild(sprite);
      delete this.sprites[id];
  }

  // update sprite
  updateSprite(me, sprite, object) {
    console.error(
      'The "updateSprite" function for sprite array must be implemented!'
      );
  }

  // Render many image sprites.
  render(me, objs) {

    //remove sprite
    const objIds = objs.map( obj => Object.values( obj )[0] );
    Object.keys( this.sprites ).filter( id => !objIds.includes( id ) ).forEach( id => {
        this.removeSprite( id );
    } )
    //add sprite
    const spriteIds = Object.keys( this.sprites );
    objs.filter( ( obj ) => !spriteIds.includes( obj.id ) ).forEach( obj => {
        this.createSpriteFromObject( me, obj );
    } )

    //update sprite
    objs.forEach( (obj) => {
        if ( this.sprites[obj.id] ) {
            this.updateSprite( me, this.sprites[obj.id], obj );
        } else {
            console.error( `id doesn't exist!` );
        }
    } ) 
  }
}

