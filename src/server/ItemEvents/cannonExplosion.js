const ItemEventClass = require('./itemEvent');
const Constants = require('./../../shared/constants')

class CannonExplosion extends ItemEventClass {
    constructor( x, y, playerID, playerName, dir ) {
        super( x, y, Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_RADIUS, playerID, playerName, dir );
        this.hasGeneratedSecondEXlopsion = false;
        this.needCollision = true;
    }
    update( dt, itemEvents ) {
        if ( !this.hasGeneratedSecondEXlopsion && Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_GENERATE_INTERVAL ) {
            const {x, y, direction, parentID, parentName} = this;
            this.hasGeneratedSecondEXlopsion = true;
            if ( x > 0 && x < Constants.MAP_SIZE && y > 0 && y < Constants.MAP_SIZE ) {
                const newCannonExplosion = new CannonExplosion( 
                    x + Math.sin(direction) * Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_RADIUS * 1.2,
                    y - Math.cos(direction) * Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_RADIUS * 1.2,
                    parentID,
                    parentName,
                    direction,
                )
                itemEvents.push( newCannonExplosion );
            }
        }
        if ( Date.now() - this.timestamp > Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_END ) this.destroy = true;
    }
    collide( players ) {
        if ( this.needCollision && Date.now() - this.timestamp >= Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_HIT ) {
            this.needCollision = false;
            Object.values(players).filter( player => player.distanceTo( this ) < this.radius + Constants.PLAYER_RADIUS ).forEach( player => {
                if ( player.id != this.parentID ) {
                    player.takeDamage( Constants.ITEM_EVENTS_PARAMETERS.CANNON_EXPLOSION_DAMAGE, this.parentID, this.parentName );
                }
            } );
        } 
    }
}

module.exports = CannonExplosion;